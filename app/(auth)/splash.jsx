import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/hooks/useAuth';
import { COLORS, SPACING, FONT_SIZES } from '../../src/config/theme';
import Storage from '../../src/utils/storage';
import { ASYNC_STORAGE_KEYS } from '../../src/config/constants';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after animations
    const timer = setTimeout(async () => {
      if (isLoading) return;

      const hasSeenOnboarding = await Storage.get(
        ASYNC_STORAGE_KEYS.ONBOARDING_COMPLETED
      );

      if (!isAuthenticated) {
        if (hasSeenOnboarding) {
          router.replace('/(auth)/login');
        } else {
          router.replace('/(auth)/onboarding');
        }
      } else {
        // Check KYC status
        if (user?.kycStatus !== 'approved') {
          router.replace('/(auth)/kyc-upload');
        } else if (user?.role === 'host') {
          router.replace('/(host)/dashboard');
        } else {
          router.replace('/(renter)/home');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, isLoading]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="car-sport" size={80} color={COLORS.white} />
        </View>
        
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text style={styles.title}>SwiftRide</Text>
          <Text style={styles.subtitle}>Rent Smart, Earn Smarter</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxxl + 8,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
  },
  version: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FONT_SIZES.sm,
  },
});