import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../../src/config/theme';

export default function MyTripsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trips</Text>
      <View style={styles.placeholder}>
        <Ionicons name="car-sport-outline" size={80} color={COLORS.gray300} />
        <Text style={styles.placeholderText}>No trips yet</Text>
        <Text style={styles.placeholderSubtext}>
          Your booking history will appear here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  placeholderSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },
});