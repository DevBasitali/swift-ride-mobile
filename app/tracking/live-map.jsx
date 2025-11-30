// app/tracking/live-map.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import trackingService from '../../src/api/services/trackingService';
import { useAuth } from '../../src/hooks/useAuth';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const { user } = useAuth();
  const mapRef = useRef(null);
  
  // Mock role check (In real app, check booking data)
  const isHost = user?.role === 'host'; 

  const [location, setLocation] = useState({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const [carStatus, setCarStatus] = useState({
    speed: 0,
    isIgnitionOn: true,
    lastUpdated: new Date(),
  });

  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);

  useEffect(() => {
    // Start polling for location
    const interval = setInterval(updateLocation, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateLocation = async () => {
    try {
      const response = await trackingService.getLocation(bookingId);
      if (response.success) {
        const newLoc = response.data;
        
        // Update map region smoothly
        const newRegion = {
          latitude: newLoc.latitude,
          longitude: newLoc.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setLocation(newRegion);
        
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        setCarStatus({
          speed: newLoc.speed,
          isIgnitionOn: newLoc.isIgnitionOn,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      console.error('Tracking error:', error);
    }
  };

  const handleKillSwitch = async (value) => {
    if (value) {
      Alert.alert(
        '⚠️ Activate Kill Switch?',
        'This will cut off the engine power. Only use in emergencies or theft.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setIsKillSwitchActive(false) },
          { 
            text: 'Activate', 
            style: 'destructive', 
            onPress: () => executeKillSwitch(true) 
          }
        ]
      );
    } else {
      executeKillSwitch(false);
    }
  };

  const executeKillSwitch = async (status) => {
    try {
      const response = await trackingService.toggleKillSwitch(bookingId, status);
      if (response.success) {
        setIsKillSwitchActive(status);
        Alert.alert('Success', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle kill switch');
    }
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={location}
      >
        <Marker
          coordinate={location}
          title="Car Location"
          description={`Speed: ${carStatus.speed} km/h`}
        >
          <View style={styles.markerContainer}>
            <View style={[
              styles.marker, 
              { backgroundColor: isKillSwitchActive ? COLORS.error : COLORS.primary }
            ]}>
              <Ionicons name="car-sport" size={24} color={COLORS.white} />
            </View>
            {isKillSwitchActive && (
              <View style={styles.disabledBadge}>
                <Text style={styles.disabledText}>DISABLED</Text>
              </View>
            )}
          </View>
        </Marker>
      </MapView>

      {/* Header Overlay */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Live Tracking</Text>
          <Text style={styles.lastUpdated}>
            Last updated: {carStatus.lastUpdated.toLocaleTimeString()}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Bottom Control Panel */}
      <View style={styles.bottomPanel}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Speed</Text>
            <Text style={styles.statValue}>{carStatus.speed} <Text style={styles.unit}>km/h</Text></Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ignition</Text>
            <Text style={[
              styles.statValue, 
              { color: carStatus.isIgnitionOn ? COLORS.success : COLORS.gray500 }
            ]}>
              {carStatus.isIgnitionOn ? 'ON' : 'OFF'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Status</Text>
            <Text style={[
              styles.statValue,
              { color: isKillSwitchActive ? COLORS.error : COLORS.success }
            ]}>
              {isKillSwitchActive ? 'LOCKED' : 'ACTIVE'}
            </Text>
          </View>
        </View>

        {/* Host Controls (Kill Switch) */}
        {isHost && (
          <View style={styles.controlBox}>
            <View style={styles.controlHeader}>
              <View>
                <Text style={styles.controlTitle}>Emergency Kill Switch</Text>
                <Text style={styles.controlSubtitle}>Disable engine remotely</Text>
              </View>
              <Switch
                trackColor={{ false: COLORS.gray300, true: COLORS.error }}
                thumbColor={COLORS.white}
                ios_backgroundColor={COLORS.gray300}
                onValueChange={handleKillSwitch}
                value={isKillSwitchActive}
              />
            </View>
            {isKillSwitchActive && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color={COLORS.error} />
                <Text style={styles.warningText}>
                  Car engine is disabled. Renter cannot start the car.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  lastUpdated: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  disabledText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: 'bold',
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  unit: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'normal',
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.gray200,
    alignSelf: 'center',
  },
  controlBox: {
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  controlSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '15',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  warningText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});