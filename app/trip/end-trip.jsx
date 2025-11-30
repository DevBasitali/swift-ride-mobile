// app/trip/end-trip.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import bookingService from '../../src/api/services/bookingService';
import walletService from '../../src/api/services/walletService'; // ✅ Import Wallet Service
import Button from '../../src/components/common/Button';
import Loader from '../../src/components/common/Loader';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function EndTripScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      const response = await bookingService.getBookingById(bookingId);
      if (response.success) {
        setBooking(response.data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    setCompleting(true);
    try {
      // 1. Update booking status to completed
      const bookingResponse = await bookingService.updateBookingStatus(bookingId, 'completed');
      
      if (bookingResponse.success) {
        // 2. Credit the amount to Host's wallet
        await walletService.processTripPayment(bookingId, booking.totalAmount);

        Alert.alert(
          'Trip Completed! 🎉',
          `The booking has been closed. Rs. ${booking.totalAmount} has been added to your wallet.`,
          [
            {
              text: 'Back to Fleet',
              onPress: () => router.replace('/(host)/my-fleet'),
            }
          ]
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to complete trip process');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loader fullScreen text="Calculating final bill..." />;
  if (!booking) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Summary</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-done-circle" size={80} color={COLORS.success} />
          <Text style={styles.title}>Ready to Complete</Text>
        </View>

        {/* Bill Summary */}
        <View style={styles.billContainer}>
          <Text style={styles.sectionTitle}>Final Invoice</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Rental Fee</Text>
            <Text style={styles.value}>Rs. {booking.totalAmount}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Damage Fees</Text>
            <Text style={styles.value}>Rs. 0</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Late Return Fee</Text>
            <Text style={styles.value}>Rs. 0</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Payout</Text>
            <Text style={styles.totalValue}>Rs. {booking.totalAmount}</Text>
          </View>
        </View>

        <Button
          title={completing ? "Processing..." : "Complete Trip"}
          onPress={handleCompleteTrip}
          loading={completing}
          disabled={completing}
          style={styles.button}
        />
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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  billContainer: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    color: COLORS.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  button: {
    marginTop: SPACING.md,
  },
});