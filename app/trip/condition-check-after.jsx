// app/trip/condition-check-after.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker'; // Not needed for mock
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function ConditionCheckAfterScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  
  const [photos, setPhotos] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  // ✅ MOCK UPLOAD FUNCTION
  const handleImagePick = (side) => {
    Alert.alert(
      "Mock Upload",
      "Simulate taking a photo for return inspection?",
      [
        {
          text: "Simulate Photo",
          onPress: () => {
            setPhotos(prev => ({ 
              ...prev, 
              [side]: 'https://via.placeholder.com/400x300?text=Return+Condition' 
            }));
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSubmit = () => {
    if (!photos.front || !photos.back || !photos.left || !photos.right) {
      Alert.alert('Required', 'Please take photos of all 4 sides of the car to document return condition.');
      return;
    }

    // Navigate to final bill summary
    router.push({
      pathname: '/trip/end-trip',
      params: { bookingId }
    });
  };

  const renderPhotoBox = (side, label) => (
    <TouchableOpacity 
      style={styles.photoBox} 
      onPress={() => handleImagePick(side)}
    >
      {photos[side] ? (
        <Image source={{ uri: photos[side] }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera" size={32} color={COLORS.primary} />
          <Text style={styles.photoLabel}>{label}</Text>
        </View>
      )}
      {photos[side] && (
        <View style={styles.checkMark}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Inspection</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Document the car's condition upon return. These photos will be used for insurance and deposit release.
          </Text>
        </View>

        <View style={styles.grid}>
          {renderPhotoBox('front', 'Front View')}
          {renderPhotoBox('back', 'Back View')}
          {renderPhotoBox('left', 'Left Side')}
          {renderPhotoBox('right', 'Right Side')}
        </View>

        <Button
          title="Confirm Condition & Generate Bill"
          onPress={handleSubmit}
          style={styles.submitButton}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '10',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoBox: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoLabel: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  checkMark: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  submitButton: {
    marginTop: SPACING.lg,
  },
});