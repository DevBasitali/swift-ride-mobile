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
import { registerValidationSchema } from '../../src/utils/validators';
import { useAuth } from '../../src/hooks/useAuth';
import { Button, Input } from '../../src/components/common';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('renter');

  const handleRegister = async (values) => {
    setLoading(true);
    
    try {
      const result = await register({
        ...values,
        role: selectedRole,
      });
      
      if (result.success) {
        Alert.alert(
          'Success!',
          'Account created successfully. Please complete KYC verification.',
          [{ text: 'Continue', onPress: () => router.replace('/(auth)/kyc-upload') }]
        );
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const RoleSelector = ({ formikProps }) => (
    <View style={styles.roleContainer}>
      <Text style={styles.roleLabel}>I want to:</Text>
      <View style={styles.roleButtons}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'renter' && styles.roleButtonActive,
          ]}
          onPress={() => {
            setSelectedRole('renter');
            formikProps.setFieldValue('role', 'renter');
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="car-outline"
            size={32}
            color={selectedRole === 'renter' ? COLORS.primary : COLORS.gray400}
          />
          <Text
            style={[
              styles.roleButtonText,
              selectedRole === 'renter' && styles.roleButtonTextActive,
            ]}
          >
            Rent Cars
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'host' && styles.roleButtonActive,
          ]}
          onPress={() => {
            setSelectedRole('host');
            formikProps.setFieldValue('role', 'host');
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="cash-outline"
            size={32}
            color={selectedRole === 'host' ? COLORS.secondary : COLORS.gray400}
          />
          <Text
            style={[
              styles.roleButtonText,
              selectedRole === 'host' && styles.roleButtonTextActive,
            ]}
          >
            Earn Money
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'both' && styles.roleButtonActive,
          ]}
          onPress={() => {
            setSelectedRole('both');
            formikProps.setFieldValue('role', 'both');
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="swap-horizontal"
            size={32}
            color={selectedRole === 'both' ? COLORS.info : COLORS.gray400}
          />
          <Text
            style={[
              styles.roleButtonText,
              selectedRole === 'both' && styles.roleButtonTextActive,
            ]}
          >
            Both
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Join SwiftRide</Text>
        <Text style={styles.subtitle}>Start renting or earning today</Text>

        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            role: 'renter',
          }}
          validationSchema={registerValidationSchema}
          onSubmit={handleRegister}
        >
          {(formikProps) => (
            <View style={styles.form}>
              <RoleSelector formikProps={formikProps} />

              <Input
                label="Full Name"
                placeholder="John Doe"
                icon="person-outline"
                value={formikProps.values.name}
                onChangeText={formikProps.handleChange('name')}
                onBlur={formikProps.handleBlur('name')}
                error={formikProps.touched.name && formikProps.errors.name}
              />

              <Input
                label="Email"
                placeholder="john@example.com"
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formikProps.values.email}
                onChangeText={formikProps.handleChange('email')}
                onBlur={formikProps.handleBlur('email')}
                error={formikProps.touched.email && formikProps.errors.email}
              />

              <Input
                label="Phone Number"
                placeholder="+1234567890"
                icon="call-outline"
                keyboardType="phone-pad"
                value={formikProps.values.phone}
                onChangeText={formikProps.handleChange('phone')}
                onBlur={formikProps.handleBlur('phone')}
                error={formikProps.touched.phone && formikProps.errors.phone}
              />

              <Input
                label="Password"
                placeholder="At least 6 characters"
                icon="lock-closed-outline"
                secureTextEntry
                value={formikProps.values.password}
                onChangeText={formikProps.handleChange('password')}
                onBlur={formikProps.handleBlur('password')}
                error={
                  formikProps.touched.password && formikProps.errors.password
                }
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                icon="lock-closed-outline"
                secureTextEntry
                value={formikProps.values.confirmPassword}
                onChangeText={formikProps.handleChange('confirmPassword')}
                onBlur={formikProps.handleBlur('confirmPassword')}
                error={
                  formikProps.touched.confirmPassword &&
                  formikProps.errors.confirmPassword
                }
              />

              <Button
                title="Create Account"
                onPress={formikProps.handleSubmit}
                loading={loading}
                style={styles.registerButton}
              />

              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          )}
        </Formik>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  roleContainer: {
    marginBottom: SPACING.lg,
  },
  roleLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  roleButton: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  roleButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  roleButtonText: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  termsText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});