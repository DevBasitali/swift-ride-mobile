// app/cars/add-car-step1.jsx

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
import Input from '../../src/components/common/InputField';
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';
import Storage from '../../src/utils/storage';

const carMakes = ['Toyota', 'Honda', 'Suzuki', 'Nissan', 'Hyundai', 'KIA', 'Mercedes', 'BMW', 'Audi', 'Other'];
const transmissionTypes = ['Automatic', 'Manual'];
const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

const validationSchema = Yup.object().shape({
  make: Yup.string().required('Car make is required'),
  model: Yup.string().required('Model is required'),
  year: Yup.number()
    .required('Year is required')
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  color: Yup.string().required('Color is required'),
  plateNumber: Yup.string().required('Plate number is required'),
  seats: Yup.number()
    .required('Number of seats is required')
    .min(2, 'Minimum 2 seats')
    .max(15, 'Maximum 15 seats'),
  transmission: Yup.string().required('Transmission type is required'),
  fuelType: Yup.string().required('Fuel type is required'),
});

export default function AddCarStep1Screen() {
  const router = useRouter();
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');

  const handleNext = async (values) => {
    try {
      // Save step 1 data to temporary storage
      await Storage.set('@add_car_step1', values);
      
      // Navigate to step 2
      router.push('/cars/add-car-step2');
    } catch (error) {
      Alert.alert('Error', 'Failed to save car details');
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
        <Text style={styles.headerTitle}>Add Car</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, styles.progressStepActive]} />
          <View style={styles.progressStep} />
          <View style={styles.progressStep} />
        </View>
        <Text style={styles.progressText}>Step 1 of 3: Basic Info</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={{
            make: '',
            model: '',
            year: '',
            color: '',
            plateNumber: '',
            seats: '5',
            transmission: '',
            fuelType: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleNext}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>
              {/* Car Make Selection */}
              <Text style={styles.label}>Car Make *</Text>
              <View style={styles.chipContainer}>
                {carMakes.map((make) => (
                  <TouchableOpacity
                    key={make}
                    style={[
                      styles.chip,
                      values.make === make && styles.chipSelected,
                    ]}
                    onPress={() => {
                      setSelectedMake(make);
                      setFieldValue('make', make);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        values.make === make && styles.chipTextSelected,
                      ]}
                    >
                      {make}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.make && errors.make && (
                <Text style={styles.errorText}>{errors.make}</Text>
              )}

              <Input
                label="Model"
                placeholder="e.g., Corolla, Civic, Alto"
                icon="car-outline"
                value={values.model}
                onChangeText={handleChange('model')}
                onBlur={handleBlur('model')}
                error={touched.model && errors.model}
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="Year"
                    placeholder="2022"
                    icon="calendar-outline"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={values.year}
                    onChangeText={handleChange('year')}
                    onBlur={handleBlur('year')}
                    error={touched.year && errors.year}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Color"
                    placeholder="White"
                    icon="color-palette-outline"
                    value={values.color}
                    onChangeText={handleChange('color')}
                    onBlur={handleBlur('color')}
                    error={touched.color && errors.color}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="Plate Number"
                    placeholder="ABC-123"
                    icon="newspaper-outline"
                    autoCapitalize="characters"
                    value={values.plateNumber}
                    onChangeText={handleChange('plateNumber')}
                    onBlur={handleBlur('plateNumber')}
                    error={touched.plateNumber && errors.plateNumber}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Seats"
                    placeholder="5"
                    icon="people-outline"
                    keyboardType="number-pad"
                    value={values.seats}
                    onChangeText={handleChange('seats')}
                    onBlur={handleBlur('seats')}
                    error={touched.seats && errors.seats}
                  />
                </View>
              </View>

              {/* Transmission Type */}
              <Text style={styles.label}>Transmission *</Text>
              <View style={styles.chipContainer}>
                {transmissionTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chip,
                      values.transmission === type && styles.chipSelected,
                    ]}
                    onPress={() => {
                      setSelectedTransmission(type);
                      setFieldValue('transmission', type);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        values.transmission === type && styles.chipTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.transmission && errors.transmission && (
                <Text style={styles.errorText}>{errors.transmission}</Text>
              )}

              {/* Fuel Type */}
              <Text style={styles.label}>Fuel Type *</Text>
              <View style={styles.chipContainer}>
                {fuelTypes.map((fuel) => (
                  <TouchableOpacity
                    key={fuel}
                    style={[
                      styles.chip,
                      values.fuelType === fuel && styles.chipSelected,
                    ]}
                    onPress={() => {
                      setSelectedFuel(fuel);
                      setFieldValue('fuelType', fuel);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        values.fuelType === fuel && styles.chipTextSelected,
                      ]}
                    >
                      {fuel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.fuelType && errors.fuelType && (
                <Text style={styles.errorText}>{errors.fuelType}</Text>
              )}

              <Button
                title="Next: Upload Photos"
                onPress={handleSubmit}
                style={styles.nextButton}
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
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  chipSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '15',
  },
  chipText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -SPACING.xs,
  },
  halfInput: {
    flex: 1,
    paddingHorizontal: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.sm,
  },
  nextButton: {
    marginTop: SPACING.xl,
  },
});