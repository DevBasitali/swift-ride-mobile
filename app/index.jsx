import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../src/config/theme';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth flow
      router.replace('/(auth)/splash');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth screens, redirect based on role
      if (user?.kycStatus !== 'approved') {
        router.replace('/(auth)/kyc-upload');
      } else if (user?.role === 'host') {
        router.replace('/(host)/dashboard');
      } else {
        router.replace('/(renter)/home');
      }
    } else if (isAuthenticated && !inAuthGroup) {
      // Already authenticated, redirect to appropriate home
      if (user?.kycStatus !== 'approved') {
        router.replace('/(auth)/kyc-upload');
      } else if (user?.role === 'host') {
        router.replace('/(host)/dashboard');
      } else {
        router.replace('/(renter)/home');
      }
    }
  }, [isAuthenticated, isLoading, user, segments]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});