// src/components/trip/TripCard.jsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../config/theme';

const getStatusColor = (status) => {
  switch (status) {
    case 'upcoming': return COLORS.info;
    case 'active': return COLORS.success;
    case 'completed': return COLORS.gray500;
    case 'cancelled': return COLORS.error;
    default: return COLORS.primary;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const TripCard = ({ booking, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header: Date & Status */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.dateText}>
            {new Date(booking.startTime).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Car Info */}
      <View style={styles.content}>
        <Image 
          source={{ uri: booking.car.image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.carTitle}>
            {booking.car.make} {booking.car.model}
          </Text>
          <Text style={styles.plateNumber}>{booking.car.plateNumber}</Text>
          
          <View style={styles.timeRow}>
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>Start</Text>
              <Text style={styles.timeValue}>{formatDate(booking.startTime)}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={COLORS.gray400} style={{ marginTop: 14 }} />
            <View style={styles.timeCol}>
              <Text style={styles.timeLabel}>End</Text>
              <Text style={styles.timeValue}>{formatDate(booking.endTime)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Price Footer */}
      <View style={styles.footer}>
        <Text style={styles.location}>📍 {booking.pickupLocation}</Text>
        <Text style={styles.price}>Rs. {booking.totalAmount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray100,
  },
  content: {
    flexDirection: 'row',
    padding: SPACING.md,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray200,
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  carTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  plateNumber: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  timeCol: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  timeValue: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderBottomLeftRadius: BORDER_RADIUS.md,
    borderBottomRightRadius: BORDER_RADIUS.md,
  },
  location: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    maxWidth: '70%',
  },
  price: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default TripCard;