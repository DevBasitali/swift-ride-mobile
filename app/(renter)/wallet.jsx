import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import { COLORS, SPACING, FONT_SIZES } from '../../src/config/theme';

export default function WalletScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>
          ${user?.walletBalance?.toFixed(2) || '0.00'}
        </Text>
        <View style={styles.balanceActions}>
          <View style={styles.actionButton}>
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Add Money</Text>
          </View>
          <View style={styles.actionButton}>
            <Ionicons name="arrow-up-circle" size={24} color={COLORS.secondary} />
            <Text style={styles.actionText}>Withdraw</Text>
          </View>
        </View>
      </View>

      <View style={styles.placeholder}>
        <Ionicons name="receipt-outline" size={60} color={COLORS.gray300} />
        <Text style={styles.placeholderText}>No transactions yet</Text>
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
  balanceCard: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    marginBottom: SPACING.xl,
  },
  balanceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
    marginVertical: SPACING.sm,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: SPACING.sm,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  actionText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
});