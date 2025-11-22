import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import {
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
} from '../../src/utils/validators';
import authService from '../../src/api/services/authService';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/InputField';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [sentOTP, setSentOTP] = useState(''); // For demo display

  const handleSendOTP = async (values) => {
    setLoading(true);

    try {
      const response = await authService.forgotPassword(values.email);

      if (response.data.success) {
        setEmail(values.email);
        setSentOTP(response.data.data.otp); // Demo only - won't be in real API
        setStep(2);
        Alert.alert(
          'OTP Sent!',
          `A 6-digit code has been sent to ${values.email}\n\n🎯 Demo OTP: ${response.data.data.otp}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    setLoading(true);

    try {
      const response = await authService.resetPassword(
        email,
        values.otp,
        values.password
      );

      if (response.data.success) {
        Alert.alert(
          'Success!',
          'Your password has been reset successfully.',
          [
            {
              text: 'Login Now',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={60} color={COLORS.primary} />
        </View>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a code to reset your password.
            </Text>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={handleSendOTP}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    icon="mail-outline"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={touched.email && errors.email}
                  />

                  <Button
                    title="Send OTP"
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.button}
                  />

                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backToLogin}
                  >
                    <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
                    <Text style={styles.backToLoginText}>Back to Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </>
        )}

        {/* Step 2: Enter OTP & New Password */}
        {step === 2 && (
          <>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to {email}. Enter it below along with your new
              password.
            </Text>

            {/* Demo OTP Display */}
            <View style={styles.demoBox}>
              <Text style={styles.demoTitle}>🎯 Demo OTP:</Text>
              <Text style={styles.demoOTP}>{sentOTP}</Text>
              <Text style={styles.demoSubtext}>
                In production, this would be sent to your email
              </Text>
            </View>

            <Formik
              initialValues={{ otp: '', password: '', confirmPassword: '' }}
              validationSchema={resetPasswordValidationSchema}
              onSubmit={handleResetPassword}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  <Input
                    label="OTP Code"
                    placeholder="Enter 6-digit code"
                    icon="keypad-outline"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={values.otp}
                    onChangeText={handleChange('otp')}
                    onBlur={handleBlur('otp')}
                    error={touched.otp && errors.otp}
                  />

                  <Input
                    label="New Password"
                    placeholder="Enter new password"
                    icon="lock-closed-outline"
                    secureTextEntry
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password && errors.password}
                  />

                  <Input
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                    icon="lock-closed-outline"
                    secureTextEntry
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={touched.confirmPassword && errors.confirmPassword}
                  />

                  <Button
                    title="Reset Password"
                    onPress={handleSubmit}
                    loading={loading}
                    style={styles.button}
                  />

                  <TouchableOpacity
                    onPress={() => setStep(1)}
                    style={styles.backToLogin}
                  >
                    <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
                    <Text style={styles.backToLoginText}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
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
  form: {
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.xs,
  },
  backToLoginText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  demoBox: {
    backgroundColor: COLORS.info + '10',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  demoOTP: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.info,
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  demoSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
});