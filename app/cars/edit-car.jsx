// app/cars/edit-car.jsx

import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../../src/components/common/InputField';
import Button from '../../src/components/common/Button';
import Loader from '../../src/components/common/Loader';
import { COLORS, SPACING, FONT_SIZES } from '../../src/config/theme';
import carService from '../../src/api/services/carService';

const validationSchema = Yup.object().shape({
  pricePerHour: Yup.number()
    .required('Hourly rate is required')
    .min(100, 'Minimum Rs. 100/hour'),
  pricePerDay: Yup.number()
    .required('Daily rate is required')
    .min(500, 'Minimum Rs. 500/day'),
  color: Yup.string().required('Color is required'),
});

export default function EditCarScreen() {
  const router = useRouter();
  const { carId } = useLocalSearchParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCarDetails();
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
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

  const handleSave = async (values) => {
    setSaving(true);

    try {
      const updateData = {
        color: values.color,
        pricePerHour: parseInt(values.pricePerHour),
        pricePerDay: parseInt(values.pricePerDay),
      };

      const response = await carService.updateCar(carId, updateData);

      if (response.success) {
        Alert.alert('Success', 'Car updated successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error updating car:', error);
      Alert.alert('Error', 'Failed to update car');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!car) {
    return null;
  }

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
        <Text style={styles.headerTitle}>Edit Car</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.carName}>
          {car.make} {car.model} ({car.year})
        </Text>

        <Formik
          initialValues={{
            color: car.color,
            pricePerHour: car.pricePerHour.toString(),
            pricePerDay: car.pricePerDay.toString(),
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <Input
                label="Color"
                placeholder="White"
                icon="color-palette-outline"
                value={values.color}
                onChangeText={handleChange('color')}
                onBlur={handleBlur('color')}
                error={touched.color && errors.color}
              />

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

              <View style={styles.noteBox}>
                <Ionicons name="information-circle" size={20} color={COLORS.info} />
                <Text style={styles.noteText}>
                  To edit make, model, or plate number, please delete and add the car again.
                </Text>
              </View>

              <Button
                title={saving ? "Saving..." : "Save Changes"}
                onPress={handleSubmit}
                loading={saving}
                disabled={saving}
                style={styles.saveButton}
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
  scrollContent: {
    padding: SPACING.lg,
  },
  carName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.info + '10',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  noteText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});