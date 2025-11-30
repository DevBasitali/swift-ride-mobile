// app/cars/add-car-scheduler.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

const DAYS = [
  { id: 1, label: 'Mon', fullName: 'Monday' },
  { id: 2, label: 'Tue', fullName: 'Tuesday' },
  { id: 3, label: 'Wed', fullName: 'Wednesday' },
  { id: 4, label: 'Thu', fullName: 'Thursday' },
  { id: 5, label: 'Fri', fullName: 'Friday' },
  { id: 6, label: 'Sat', fullName: 'Saturday' },
  { id: 0, label: 'Sun', fullName: 'Sunday' },
];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

export default function AddCarSchedulerScreen() {
  const router = useRouter();
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]); // Default Mon-Fri
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [officeLocation, setOfficeLocation] = useState('');

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort());
    }
  };

  const handleSave = () => {
    if (selectedDays.length === 0) {
      Alert.alert('Required', 'Please select at least one day');
      return;
    }

    if (startTime >= endTime) {
      Alert.alert('Invalid Time', 'End time must be after start time');
      return;
    }

    const schedule = {
      daysOfWeek: selectedDays,
      startTime,
      endTime,
    };

    console.log('📅 Schedule saved:', schedule);

    Alert.alert(
      'Schedule Saved ✅',
      `Your car will be available:\n\n${getDaysString()} from ${startTime} to ${endTime}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getDaysString = () => {
    return selectedDays
      .map(id => DAYS.find(d => d.id === id)?.label)
      .join(', ');
  };

  const handleQuickSelect = (preset) => {
    switch (preset) {
      case 'weekdays':
        setSelectedDays([1, 2, 3, 4, 5]);
        break;
      case 'weekend':
        setSelectedDays([0, 6]);
        break;
      case 'everyday':
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>9-to-5 Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Set when your car is available for rent during your office/work hours
          </Text>
        </View>

        {/* Quick Select */}
        <Text style={styles.sectionTitle}>Quick Select</Text>
        <View style={styles.quickSelectContainer}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickSelect('weekdays')}
          >
            <Ionicons name="briefcase-outline" size={20} color={COLORS.primary} />
            <Text style={styles.quickButtonText}>Weekdays</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickSelect('weekend')}
          >
            <Ionicons name="sunny-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.quickButtonText}>Weekend</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => handleQuickSelect('everyday')}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.info} />
            <Text style={styles.quickButtonText}>Every Day</Text>
          </TouchableOpacity>
        </View>

        {/* Day Selection */}
        <Text style={styles.sectionTitle}>Select Days</Text>
        <View style={styles.daysContainer}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayButton,
                selectedDays.includes(day.id) && styles.dayButtonSelected,
              ]}
              onPress={() => toggleDay(day.id)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDays.includes(day.id) && styles.dayButtonTextSelected,
                ]}
              >
                {day.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Days Preview */}
        {selectedDays.length > 0 && (
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Selected:</Text>
            <Text style={styles.previewText}>{getDaysString()}</Text>
          </View>
        )}

        {/* Time Selection */}
        <Text style={styles.sectionTitle}>Available Hours</Text>

        {/* Start Time */}
        <Text style={styles.label}>Start Time</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeScrollContainer}
        >
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={`start-${time}`}
              style={[
                styles.timeSlot,
                startTime === time && styles.timeSlotSelected,
              ]}
              onPress={() => setStartTime(time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  startTime === time && styles.timeSlotTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* End Time */}
        <Text style={styles.label}>End Time</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeScrollContainer}
        >
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={`end-${time}`}
              style={[
                styles.timeSlot,
                endTime === time && styles.timeSlotSelected,
              ]}
              onPress={() => setEndTime(time)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  endTime === time && styles.timeSlotTextSelected,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Ionicons name="time-outline" size={24} color={COLORS.secondary} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Availability Summary</Text>
            <Text style={styles.summaryText}>
              {selectedDays.length > 0 
                ? `Available on ${getDaysString()} from ${startTime} to ${endTime}`
                : 'No days selected'}
            </Text>
            {startTime && endTime && (
              <Text style={styles.summaryDuration}>
                Duration: {calculateDuration(startTime, endTime)} hours/day
              </Text>
            )}
          </View>
        </View>

        {/* Example */}
        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>💡 Example:</Text>
          <Text style={styles.exampleText}>
            Mon-Fri, 9:00-17:00: Your car is parked at office from 9am to 5pm. 
            You can earn money while you work!
          </Text>
        </View>

        <Button
          title="Save Schedule"
          onPress={handleSave}
          disabled={selectedDays.length === 0}
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  );
}

const calculateDuration = (start, end) => {
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  return Math.max(0, endHour - startHour);
};

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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.info + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  quickSelectContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray100,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginRight: SPACING.sm,
  },
  quickButtonText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginLeft: SPACING.xs,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gray100,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.secondary + '20',
    borderColor: COLORS.secondary,
  },
  dayButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayButtonTextSelected: {
    color: COLORS.secondary,
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  previewLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  previewText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  timeScrollContainer: {
    marginBottom: SPACING.lg,
  },
  timeSlot: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.gray300,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  timeSlotSelected: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '15',
  },
  timeSlotText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.secondary + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  summaryContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  summaryTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  summaryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  summaryDuration: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  exampleBox: {
    backgroundColor: COLORS.warning + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  exampleTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  exampleText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});