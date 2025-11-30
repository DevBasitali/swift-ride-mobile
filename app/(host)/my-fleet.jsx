// app/(host)/my-fleet.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import carService from '../../src/api/services/carService';
import CarCard from '../../src/components/car/CarCard';
import { COLORS, SPACING, FONT_SIZES } from '../../src/config/theme';

export default function MyFleetScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const response = await carService.getHostCars(user.id);
      
      if (response.success) {
        setCars(response.data);
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      Alert.alert('Error', 'Failed to load your cars');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCars();
    setRefreshing(false);
  };

  const handleAddCar = () => {
    router.push('/cars/add-car-step1');
  };

  const handleEditCar = (car) => {
    router.push({
      pathname: '/cars/edit-car',
      params: { carId: car.id },
    });
  };

  const handleDeleteCar = (car) => {
    Alert.alert(
      'Delete Car',
      `Are you sure you want to delete ${car.make} ${car.model}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await carService.deleteCar(car.id);
              
              if (response.success) {
                Alert.alert('Success', 'Car deleted successfully');
                loadCars();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete car');
            }
          },
        },
      ]
    );
  };

  const handleCarPress = (car) => {
    router.push({
      pathname: '/cars/[id]',
      params: { id: car.id },
    });
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={80} color={COLORS.gray300} />
      <Text style={styles.emptyTitle}>No Cars Yet</Text>
      <Text style={styles.emptyText}>
        Add your first car to start earning money
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddCar}>
        <Ionicons name="add-circle" size={20} color={COLORS.white} />
        <Text style={styles.emptyButtonText}>Add Your First Car</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Fleet</Text>
          <Text style={styles.subtitle}>{cars.length} {cars.length === 1 ? 'car' : 'cars'}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCar}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Car List */}
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onPress={() => handleCarPress(item)}
            onEdit={handleEditCar}
            onDelete={handleDeleteCar}
            showActions={true}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading && renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
});