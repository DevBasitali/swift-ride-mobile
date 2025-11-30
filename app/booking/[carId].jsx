// app/booking/[carId].jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import carService from '../../src/api/services/carService';
import Button from '../../src/components/common/Button';
import Loader from '../../src/components/common/Loader';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function BookingScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams();
  const { user } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Mock Dates
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 3600000)); // +1 hour
  
  // Simple Mock Picker State
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('start'); // 'start' or 'end'

  useEffect(() => {
    if (carId) loadCarDetails();
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      const response = await carService.getCarById(carId);
      if (response.success) {
        setCar(response.data);
      } else {
        Alert.alert('Error', 'Car not found');
        router.back();
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to load car');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (hoursToAdd) => {
    const newDate = new Date();
    newDate.setHours(newDate.getHours() + hoursToAdd);
    
    if (pickerMode === 'start') {
      setStartDate(newDate);
      setEndDate(new Date(newDate.getTime() + 3600000)); // Auto set end +1hr
    } else {
      setEndDate(newDate);
    }
    setShowPicker(false);
  };

  const calculatePrice = () => {
    const hours = Math.ceil((endDate - startDate) / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    let total = 0;
    if (days > 0) total += days * (car?.pricePerDay || 0);
    if (remainingHours > 0) total += remainingHours * (car?.pricePerHour || 0);
    
    const serviceFee = Math.round(total * 0.05);
    const insurance = Math.round(total * 0.03);
    
    return {
      hours: Math.max(0, hours),
      days,
      remainingHours,
      subtotal: total,
      serviceFee,
      insurance,
      total: total + serviceFee + insurance,
    };
  };

  const handleBooking = async () => {
    const pricing = calculatePrice();
    Alert.alert(
      'Confirm Booking',
      `Total: Rs. ${pricing.total}\nDuration: ${pricing.hours} hours`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setBookingLoading(true);
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
            }, 1000);
          },
        },
      ]
    );
  };

  if (loading) return <Loader fullScreen text="Loading..." />;
  if (!car) return null;

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

      <ScrollView style={styles.content}>
        {/* Car Info */}
        <View style={styles.carInfo}>
          <Ionicons name="car-sport" size={32} color={COLORS.primary} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.carName}>{car.make} {car.model}</Text>
            <Text style={styles.carSubtitle}>Rs. {car.pricePerHour}/hr</Text>
          </View>
        </View>

        {/* Date Selection */}
        <Text style={styles.sectionTitle}>Select Time</Text>
        
        <TouchableOpacity style={styles.dateButton} onPress={() => { setPickerMode('start'); setShowPicker(true); }}>
          <Text>Start: {startDate.toLocaleString()}</Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateButton} onPress={() => { setPickerMode('end'); setShowPicker(true); }}>
          <Text>End: {endDate.toLocaleString()}</Text>
          <Ionicons name="chevron-down" size={20} />
        </TouchableOpacity>

        {/* Pricing */}
        <View style={styles.pricingBox}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.row}><Text>Subtotal</Text><Text>Rs. {pricing.subtotal}</Text></View>
          <View style={styles.row}><Text>Service Fee</Text><Text>Rs. {pricing.serviceFee}</Text></View>
          <View style={styles.row}><Text>Insurance</Text><Text>Rs. {pricing.insurance}</Text></View>
          <View style={[styles.row, { marginTop: 10, borderTopWidth: 1, paddingTop: 5 }]}>
            <Text style={{ fontWeight: 'bold' }}>Total</Text>
            <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>Rs. {pricing.total}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Proceed to Payment" onPress={handleBooking} loading={bookingLoading} />
      </View>

      {/* Custom Mock Picker Modal */}
      <Modal visible={showPicker} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {pickerMode === 'start' ? 'Start' : 'End'} Time</Text>
            {[1, 3, 6, 12, 24, 48].map((hrs) => (
              <TouchableOpacity key={hrs} style={styles.modalOption} onPress={() => handleDateChange(hrs)}>
                <Text>In {hrs} Hours</Text>
              </TouchableOpacity>
            ))}
            <Button title="Cancel" onPress={() => setShowPicker(false)} variant="outline" style={{ marginTop: 10 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', padding: SPACING.lg, paddingTop: SPACING.xxl, alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
  content: { padding: SPACING.lg },
  carInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl, backgroundColor: COLORS.gray50, padding: SPACING.md, borderRadius: 10 },
  carName: { fontWeight: 'bold', fontSize: FONT_SIZES.md },
  carSubtitle: { color: COLORS.textSecondary },
  sectionTitle: { fontWeight: 'bold', marginBottom: SPACING.sm, marginTop: SPACING.md },
  dateButton: { padding: SPACING.md, borderWidth: 1, borderColor: COLORS.gray300, borderRadius: 8, marginBottom: SPACING.md, flexDirection: 'row', justifyContent: 'space-between' },
  pricingBox: { backgroundColor: COLORS.gray50, padding: SPACING.md, borderRadius: 10, marginTop: SPACING.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  footer: { padding: SPACING.lg, borderTopWidth: 1, borderColor: COLORS.gray200 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontWeight: 'bold', fontSize: 18, marginBottom: 15, textAlign: 'center' },
  modalOption: { padding: 15, borderBottomWidth: 1, borderColor: '#eee' },
});