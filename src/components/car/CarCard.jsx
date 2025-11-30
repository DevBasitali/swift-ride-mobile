// src/components/car/CarCard.jsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../config/theme';

const CarCard = ({ car, onPress, onEdit, onDelete, showActions = false }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Car Image */}
      <Image 
        source={{ uri: car.photos[0] }} 
        style={styles.image}
        resizeMode="cover"
      />

      {/* Availability Badge */}
      <View style={[
        styles.badge,
        { backgroundColor: car.availability?.isAvailable ? COLORS.success : COLORS.gray400 }
      ]}>
        <Text style={styles.badgeText}>
          {car.availability?.isAvailable ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      {/* Car Info */}
      <View style={styles.info}>
        <Text style={styles.title}>
          {car.make} {car.model}
        </Text>
        <Text style={styles.subtitle}>{car.year} • {car.color}</Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="speedometer-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.featureText}>{car.transmission}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="water-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.featureText}>{car.fuelType}</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.featureText}>{car.seats} Seats</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>Rs. {car.pricePerHour}/hr</Text>
            <Text style={styles.priceSubtext}>Rs. {car.pricePerDay}/day</Text>
          </View>

          {showActions && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit(car);
                }}
              >
                <Ionicons name="create-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(car);
                }}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.gray200,
  },
  badge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  info: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  features: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  deleteButton: {
    backgroundColor: COLORS.error + '15',
  },
});

export default CarCard;