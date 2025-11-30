// app/cars/add-car-step3.jsx

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
import * as Yup from 'yup';
import Input from '../../src/components/common/InputField'
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';
import Storage from '../../src/utils/storage';
import carService from '../../src/api/services/carService';
import { useAuth } from '../../src/hooks/useAuth';

const validationSchema = Yup.object().shape({
  pricePerHour: Yup.number()
    .required('Hourly rate is required')
    .min(100, 'Minimum Rs. 100/hour')
    .max(10000, 'Maximum Rs. 10,000/hour'),
  pricePerDay: Yup.number()
    .required('Daily rate is required')
    .min(500, 'Minimum Rs. 500/day')
    .max(50000, 'Maximum Rs. 50,000/day'),
  address: Yup.string().required('Pickup location is required'),
});

const features = [
  { id: 'AC', label: 'Air Conditioning', icon: 'snow-outline' },
  { id: 'USB', label: 'USB Charger', icon: 'battery-charging-outline' },
  { id: 'Bluetooth', label: 'Bluetooth', icon: 'bluetooth-outline' },
  { id: 'GPS', label: 'GPS Navigation', icon: 'navigate-outline' },
  { id: 'Sunroof', label: 'Sunroof', icon: 'sunny-outline' },
  { id: 'Camera', label: 'Rear Camera', icon: 'camera-outline' },
  { id: 'Sensors', label: 'Parking Sensors', icon: 'radio-outline' },
  { id: 'Cruise', label: 'Cruise Control', icon: 'speedometer-outline' },
];

export default function AddCarStep3Screen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleFeature = (featureId) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== featureId));
    } else {
      setSelectedFeatures([...selectedFeatures, featureId]);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // Get data from previous steps
      const step1Data = await Storage.get('@add_car_step1');
      const step2Data = await Storage.get('@add_car_step2');

      if (!step1Data) {
        Alert.alert('Error', 'Basic information is missing. Please start over.');
        router.replace('/cars/add-car-step1');
        return;
      }

      // Combine all data
      const carData = {
        ...step1Data,
        photos: step2Data?.photos || [],
        pricePerHour: parseInt(values.pricePerHour),
        pricePerDay: parseInt(values.pricePerDay),
        location: {
          address: values.address,
          lat: 31.5204, // Mock coordinates
          lng: 74.3587,
        },
        availability: {
          daysOfWeek: [1, 2, 3, 4, 5], // Default Mon-Fri
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
        },
        features: selectedFeatures,
        hostId: user.id,
      };

      console.log('📝 Submitting car:', carData);

      // Submit to service
      const response = await carService.addCar(carData);

      if (response.success) {
        // Clear temporary storage
        await Storage.remove('@add_car_step1');
        await Storage.remove('@add_car_step2');

        Alert.alert(
          'Success! 🎉',
          'Your car has been added successfully',
          [
            {
              text: 'View My Fleet',
              onPress: () => router.replace('/(host)/my-fleet'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error adding car:', error);
      Alert.alert('Error', 'Failed to add car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Car</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.progressStepActive]} />
          <View style={[styles.progressStep, styles.progressStepActive]} />
          <View style={[styles.progressStep, styles.progressStepActive]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 3: Pricing & Features</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={{
            pricePerHour: '',
            pricePerDay: '',
            address: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <Text style={styles.sectionTitle}>💰 Pricing</Text>

              <Input
                label="Price per Hour (Rs.)"
                placeholder="500"
                icon="cash-outline"
                keyboardType="number-pad"
                value={values.pricePerHour}
                onChangeText={handleChange('pricePerHour')}
                onBlur={handleBlur('pricePerHour')}
                error={touched.pricePerHour && errors.pricePerHour}
              />

              <Input
                label="Price per Day (Rs.)"
                placeholder="3000"
                icon="wallet-outline"
                keyboardType="number-pad"
                value={values.pricePerDay}
                onChangeText={handleChange('pricePerDay')}
                onBlur={handleBlur('pricePerDay')}
                error={touched.pricePerDay && errors.pricePerDay}
              />

              {/* Pricing Suggestion */}
              <View style={styles.suggestionBox}>
                <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
                <Text style={styles.suggestionText}>
                  Suggested: Rs. 400-800/hr or Rs. 2500-5000/day for similar cars
                </Text>
              </View>

              <Text style={styles.sectionTitle}>📍 Pickup Location</Text>

              <Input
                label="Address"
                placeholder="Enter your office/home address"
                icon="location-outline"
                multiline
                numberOfLines={2}
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                error={touched.address && errors.address}
              />

              <TouchableOpacity 
                style={styles.schedulerButton}
                onPress={() => router.push('/cars/add-car-scheduler')}
              >
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                <Text style={styles.schedulerButtonText}>
                  Set 9-to-5 Availability Schedule
                </Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>✨ Features</Text>
              <Text style={styles.sectionSubtitle}>
                Select features available in your car
              </Text>

              <View style={styles.featuresGrid}>
                {features.map((feature) => (
                  <TouchableOpacity
                    key={feature.id}
                    style={[
                      styles.featureChip,
                      selectedFeatures.includes(feature.id) && styles.featureChipSelected,
                    ]}
                    onPress={() => toggleFeature(feature.id)}
                  >
                    <Ionicons
                      name={feature.icon}
                      size={20}
                      color={selectedFeatures.includes(feature.id) ? COLORS.secondary : COLORS.gray400}
                    />
                    <Text
                      style={[
                        styles.featureText,
                        selectedFeatures.includes(feature.id) && styles.featureTextSelected,
                      ]}
                    >
                      {feature.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title={loading ? "Adding Car..." : "Add Car to Fleet"}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>
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
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  progressBar: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.gray200,
    marginRight: SPACING.xs,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: COLORS.secondary,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  suggestionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  suggestionText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  schedulerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  schedulerButtonText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
    marginBottom: SPACING.lg,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    margin: SPACING.xs,
    backgroundColor: COLORS.white,
  },
  featureChipSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '15',
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  featureTextSelected: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: SPACING.xl,
  },
});