// app/modal/filter.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

const TRANSMISSION_OPTIONS = ['All', 'Automatic', 'Manual'];
const FUEL_OPTIONS = ['All', 'Petrol', 'Diesel', 'Hybrid', 'Electric'];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

export default function FilterModal() {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([100, 2000]);
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00');
  const [selectedSeats, setSelectedSeats] = useState('All');

  const handleApplyFilters = () => {
    const filters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      transmission: selectedTransmission !== 'All' ? selectedTransmission : null,
      fuelType: selectedFuel !== 'All' ? selectedFuel : null,
      timeSlot: selectedTimeSlot,
      seats: selectedSeats !== 'All' ? parseInt(selectedSeats) : null,
    };

    console.log('🔍 Applying filters:', filters);
    
    // TODO: Apply filters to car list
    router.back();
  };

  const handleReset = () => {
    setPriceRange([100, 2000]);
    setSelectedTransmission('All');
    setSelectedFuel('All');
    setSelectedTimeSlot('09:00');
    setSelectedSeats('All');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range (Per Hour)</Text>
          <View style={styles.priceDisplay}>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Min</Text>
              <Text style={styles.priceValue}>Rs. {priceRange[0]}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Max</Text>
              <Text style={styles.priceValue}>Rs. {priceRange[1]}</Text>
            </View>
          </View>
          
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={5000}
              step={100}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.gray300}
              thumbTintColor={COLORS.primary}
              value={priceRange[0]}
              onValueChange={(value) => setPriceRange([value, priceRange[1]])}
            />
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={5000}
              step={100}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.gray300}
              thumbTintColor={COLORS.primary}
              value={priceRange[1]}
              onValueChange={(value) => setPriceRange([priceRange[0], value])}
            />
          </View>
        </View>

        {/* Time Slot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Time Slot</Text>
          <Text style={styles.sectionSubtitle}>
            Filter cars available at this time
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.timeSlotContainer}
          >
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTimeSlot(time)}
              >
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={selectedTimeSlot === time ? COLORS.white : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === time && styles.timeSlotTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Transmission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transmission</Text>
          <View style={styles.optionsGrid}>
            {TRANSMISSION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  selectedTransmission === option && styles.optionChipSelected,
                ]}
                onPress={() => setSelectedTransmission(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedTransmission === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fuel Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fuel Type</Text>
          <View style={styles.optionsGrid}>
            {FUEL_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  selectedFuel === option && styles.optionChipSelected,
                ]}
                onPress={() => setSelectedFuel(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedFuel === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Seats</Text>
          <View style={styles.optionsGrid}>
            {['All', '2', '4', '5', '7', '8+'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionChip,
                  selectedSeats === option && styles.optionChipSelected,
                ]}
                onPress={() => setSelectedSeats(option)}
              >
                <Ionicons
                  name="people"
                  size={16}
                  color={selectedSeats === option ? COLORS.white : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.optionText,
                    selectedSeats === option && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Apply Filters"
          onPress={handleApplyFilters}
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
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  resetText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  priceDisplay: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  priceBox: {
    flex: 1,
    alignItems: 'center',
  },
  priceDivider: {
    width: 1,
    backgroundColor: COLORS.gray300,
    marginHorizontal: SPACING.md,
  },
  priceLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  priceValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  sliderContainer: {
    paddingHorizontal: SPACING.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeSlotContainer: {
    marginTop: SPACING.sm,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.white,
    minWidth: 90,
  },
  timeSlotSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  timeSlotTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  optionChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  optionTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
});