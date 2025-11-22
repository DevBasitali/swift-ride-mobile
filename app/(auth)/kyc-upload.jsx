import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function KYCUploadScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSkip = () => {
    Alert.alert(
      'Skip KYC?',
      'You can complete KYC verification later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            if (user?.role === 'host') {
              router.replace('/(host)/dashboard');
            } else {
              router.replace('/(renter)/home');
            }
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    if (user?.role === 'host') {
      router.replace('/(host)/dashboard');
    } else {
      router.replace('/(renter)/home');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={60} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>KYC Verification</Text>
        <Text style={styles.subtitle}>
          Please upload clear photos of your CNIC and a selfie for identity verification.
        </Text>

        {/* Upload Cards Placeholder */}
        <View style={styles.uploadSection}>
          <View style={styles.uploadCard}>
            <View style={styles.uploadCardHeader}>
              <View style={styles.uploadCardTitle}>
                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                <Text style={styles.uploadCardTitleText}>CNIC Front Side</Text>
              </View>
            </View>
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={40} color={COLORS.gray400} />
              <Text style={styles.uploadPlaceholderText}>Camera feature coming soon</Text>
            </View>
          </View>

          <View style={styles.uploadCard}>
            <View style={styles.uploadCardHeader}>
              <View style={styles.uploadCardTitle}>
                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                <Text style={styles.uploadCardTitleText}>CNIC Back Side</Text>
              </View>
            </View>
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={40} color={COLORS.gray400} />
              <Text style={styles.uploadPlaceholderText}>Camera feature coming soon</Text>
            </View>
          </View>

          <View style={styles.uploadCard}>
            <View style={styles.uploadCardHeader}>
              <View style={styles.uploadCardTitle}>
                <Ionicons name="person-circle-outline" size={20} color={COLORS.primary} />
                <Text style={styles.uploadCardTitleText}>Your Selfie</Text>
              </View>
            </View>
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={40} color={COLORS.gray400} />
              <Text style={styles.uploadPlaceholderText}>Camera feature coming soon</Text>
            </View>
          </View>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesBox}>
          <Text style={styles.guidelinesTitle}>📋 Guidelines:</Text>
          <Text style={styles.guidelineItem}>• Ensure documents are clear and readable</Text>
          <Text style={styles.guidelineItem}>• Avoid glare and shadows</Text>
          <Text style={styles.guidelineItem}>• All corners must be visible</Text>
          <Text style={styles.guidelineItem}>• Selfie should match CNIC photo</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to App</Text>
        </TouchableOpacity>

        <Text style={styles.infoText}>
          Camera upload will be enabled in the next update. For now, you can explore the app.
        </Text>
      </ScrollView>
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
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  skipButton: {
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  uploadSection: {
    marginBottom: SPACING.lg,
  },
  uploadCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginBottom: SPACING.lg,
  },
  uploadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  uploadCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadCardTitleText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  uploadPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: 'dashed',
  },
  uploadPlaceholderText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  guidelinesBox: {
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  guidelinesTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  guidelineItem: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  infoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});