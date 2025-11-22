import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../src/config/theme';

export default function HostDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Host'} 🚗</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="cash"
          label="Total Earnings"
          value={`$${user?.walletBalance?.toFixed(2) || '0.00'}`}
          color={COLORS.secondary}
        />
        <StatCard
          icon="car-sport"
          label="Active Rentals"
          value="0"
          color={COLORS.primary}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <ActionCard icon="add-circle" label="Add New Car" color={COLORS.primary} />
          <ActionCard icon="navigate" label="Track Cars" color={COLORS.info} />
          <ActionCard icon="calendar" label="Bookings" color={COLORS.secondary} />
          <ActionCard icon="stats-chart" label="Analytics" color={COLORS.warning} />
        </View>
      </View>

      {/* Host Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Host Features</Text>
        <View style={styles.featureList}>
          <FeatureItem icon="time" text="9-to-5 scheduling" />
          <FeatureItem icon="location" text="GPS tracking" />
          <FeatureItem icon="shield-checkmark" text="Insurance coverage" />
          <FeatureItem icon="notifications" text="Instant notifications" />
        </View>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const StatCard = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { backgroundColor: color + '15' }]}>
    <Ionicons name={icon} size={32} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionCard = ({ icon, label, color }) => (
  <TouchableOpacity style={styles.actionCard}>
    <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={20} color={COLORS.secondary} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

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
    paddingBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  featureList: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  featureText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  logoutButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
});