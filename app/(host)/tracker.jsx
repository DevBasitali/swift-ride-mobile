// app/(host)/tracker.jsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import bookingService from '../../src/api/services/bookingService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function TrackerListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTrips, setActiveTrips] = useState([]);

  useEffect(() => {
    loadActiveTrips();
  }, []);

  const loadActiveTrips = async () => {
    const response = await bookingService.getUserBookings(user?.id, 'host');
    if (response.success) {
      // Filter only active trips
      const active = response.data.filter(b => b.status === 'active');
      setActiveTrips(active);
    }
  };

  const handleTrack = (booking) => {
    router.push({
      pathname: '/tracking/live-map',
      params: { bookingId: booking.id }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GPS Tracker</Text>
      </View>

      {activeTrips.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="navigate-circle-outline" size={80} color={COLORS.gray300} />
          <Text style={styles.emptyText}>No active trips to track</Text>
        </View>
      ) : (
        <FlatList
          data={activeTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.car.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.title}>{item.car.make} {item.car.model}</Text>
                <Text style={styles.sub}>{item.car.plateNumber}</Text>
                <Text style={styles.renter}>Renter: {item.renter.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.trackButton}
                onPress={() => handleTrack(item)}
              >
                <Ionicons name="locate" size={20} color={COLORS.white} />
                <Text style={styles.trackText}>Track</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
  headerTitle: { fontSize: FONT_SIZES.xxxl, fontWeight: 'bold', color: COLORS.textPrimary },
  list: { padding: SPACING.lg },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: SPACING.md, color: COLORS.textSecondary },
  card: { flexDirection: 'row', padding: SPACING.md, backgroundColor: COLORS.gray50, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md, alignItems: 'center' },
  image: { width: 60, height: 60, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.gray200 },
  info: { flex: 1, marginLeft: SPACING.md },
  title: { fontWeight: 'bold', fontSize: FONT_SIZES.md },
  sub: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  renter: { fontSize: FONT_SIZES.xs, color: COLORS.primary, marginTop: 4 },
  trackButton: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.full, flexDirection: 'row', alignItems: 'center', gap: 4 },
  trackText: { color: COLORS.white, fontSize: FONT_SIZES.xs, fontWeight: 'bold' },
});