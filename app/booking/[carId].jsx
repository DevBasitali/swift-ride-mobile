// app/booking/[carId].jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput // Fallback for DateTimePicker if needed
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// ✅ Ensure this package is installed: npx expo install @react-native-community/datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker'; 
import carService from '../../src/api/services/carService';
import Button from '../../src/components/common/Button';
import Loader from '../../src/components/common/Loader';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function BookingScreen() {
  const router = useRouter();
  
  // ✅ CRITICAL: This must match the filename [carId].jsx
  const { carId } = useLocalSearchParams(); 
  
  const { user } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // +1 hour
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (carId) {
      loadCarDetails();
    }
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      // ✅ Using carId here
      const response = await carService.getCarById(carId);
      
      if (response.success) {
        setCar(response.data);
      }
    } catch (error) {
      console.error('Error loading car:', error);
      Alert.alert('Error', 'Failed to load car details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    let total = 0;
    if (days > 0) {
      total += days * car.pricePerDay;
    }
    if (remainingHours > 0) {
      total += remainingHours * car.pricePerHour;
    }
    
    const serviceFee = Math.round(total * 0.05); // 5% service fee
    const insurance = Math.round(total * 0.03); // 3% insurance
    
    return {
      hours,
      days,
      remainingHours,
      subtotal: total,
      serviceFee,
      insurance,
      total: total + serviceFee + insurance,
    };
  };

  const handleBooking = async () => {
    if (endDate <= startDate) {
      Alert.alert('Invalid Time', 'End time must be after start time');
      return;
    }

    const pricing = calculatePrice();

    Alert.alert(
      'Confirm Booking',
      `Total: Rs. ${pricing.total}\n\nDuration: ${pricing.hours} hours\n\nProceed to payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setBookingLoading(true);
            
            // Simulate booking API call delay
            setTimeout(() => {
              setBookingLoading(false);
              router.push({
                pathname: '/booking/success',
                params: {
                  carName: `${car.make} ${car.model}`,
                  amount: pricing.total,
                  bookingId: `BK${Date.now()}`,
                },
              });
            }, 1500);
          },
        },
      ]
    );
  };

  if (loading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!car) {
    return null;
  }

  const pricing = calculatePrice();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Car</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Info */}
        <View style={styles.carInfo}>
          <View style={styles.carIcon}>
            <Ionicons name="car-sport" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.carDetails}>
            <Text style={styles.carName}>{car.make} {car.model}</Text>
            <Text style={styles.carSubtitle}>{car.year} • {car.color}</Text>
          </View>
        </View>

        {/* Date & Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date & Time</Text>
          
          {/* Start Time */}
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowStartPicker(true)}
          >
            <View style={styles.dateTimeIcon}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>Start Time</Text>
              <Text style={styles.dateTimeValue}>
                {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              is24Hour={false}
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                  // Auto-set end time to 1 hour later
                  setEndDate(new Date(selectedDate.getTime() + 3600000));
                }
              }}
            />
          )}

          {/* End Time */}
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowEndPicker(true)}
          >
            <View style={styles.dateTimeIcon}>
              <Ionicons name="calendar" size={20} color={COLORS.secondary} />
            </View>
            <View style={styles.dateTimeContent}>
              <Text style={styles.dateTimeLabel}>End Time</Text>
              <Text style={styles.dateTimeValue}>
                {endDate.toLocaleDateString()} {endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
          </TouchableOpacity>

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="datetime"
              is24Hour={false}
              minimumDate={startDate}
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  setEndDate(selectedDate);
                }
              }}
            />
          )}

          {/* Duration Display */}
          <View style={styles.durationBox}>
            <Ionicons name="time" size={20} color={COLORS.info} />
            <Text style={styles.durationText}>
              Duration: {pricing.hours} hours
              {pricing.days > 0 && ` (${pricing.days} ${pricing.days === 1 ? 'day' : 'days'})`}
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>Rs. {pricing.subtotal}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Fee (5%)</Text>
              <Text style={styles.priceValue}>Rs. {pricing.serviceFee}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Insurance (3%)</Text>
              <Text style={styles.priceValue}>Rs. {pricing.insurance}</Text>
            </View>
            
            <View style={styles.priceDivider} />
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabelTotal}>Total</Text>
              <Text style={styles.priceValueTotal}>Rs. {pricing.total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Total</Text>
          <Text style={styles.footerPriceValue}>Rs. {pricing.total}</Text>
        </View>
        <Button
          title={bookingLoading ? "Processing..." : "Proceed to Payment"}
          onPress={handleBooking}
          loading={bookingLoading}
          disabled={bookingLoading || endDate <= startDate}
        />
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
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
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  carIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carDetails: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  carName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  carSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  dateTimeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  dateTimeLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  dateTimeValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  durationText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.info,
    marginLeft: SPACING.sm,
  },
  priceBreakdown: {
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  priceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  priceLabelTotal: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  priceValueTotal: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  priceDivider: {
    height: 1,
    backgroundColor: COLORS.gray300,
    marginVertical: SPACING.sm,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    backgroundColor: COLORS.white,
  },
  footerPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  footerPriceLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  footerPriceValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});