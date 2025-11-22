import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES } from '../../src/config/theme';

export default function RenterHomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || 'Renter'} 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="map-outline" size={80} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Renter Mode</Text>
        <Text style={styles.subtitle}>
          This is where the map view with available cars will be displayed
        </Text>

        <View style={styles.featureList}>
          <FeatureItem icon="location" text="Browse cars near you" />
          <FeatureItem icon="calendar" text="Book by date & time" />
          <FeatureItem icon="card" text="Secure payments" />
          <FeatureItem icon="shield-checkmark" text="Insurance included" />
        </View>

        <View style={styles.statusCard}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>Account Active</Text>
            <Text style={styles.statusSubtitle}>
              KYC Status: {user?.kycStatus || 'Pending'}
            </Text>
          </View>
        </View>

        <Button title="Logout" onPress={handleLogout} variant="outline" />
      </View>
    </View>
  );
}

const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Ionicons name={icon} size={20} color={COLORS.primary} />
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
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  featureList: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
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
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  statusSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
});