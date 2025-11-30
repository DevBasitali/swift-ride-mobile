// app/trip/condition-check-before.jsx

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
import * as ImagePicker from 'expo-image-picker';
import bookingService from '../../src/api/services/bookingService';
import Button from '../../src/components/common/Button';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function ConditionCheckBeforeScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  
  const [photos, setPhotos] = useState({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  // MOCK VERSION - Bypass real camera/gallery
const handleImagePick = (side) => {
  Alert.alert(
    "Mock Upload",
    "Since we are testing, let's simulate taking a photo.",
    [
      {
        text: "Simulate Photo",
        onPress: () => {
          // Set a dummy image URL
          setPhotos(prev => ({ 
            ...prev, 
            [side]: 'https://via.placeholder.com/400x300?text=Car+Condition' 
          }));
        }
      },
      { text: "Cancel", style: "cancel" }
    ]
  );
};

  const openCamera = async (side) => {
    // Request Permission first
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos(prev => ({ ...prev, [side]: result.assets[0].uri }));
    }
  };

  const openGallery = async (side) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos(prev => ({ ...prev, [side]: result.assets[0].uri }));
    }
  };

  const handleSubmit = async () => {
    if (!photos.front || !photos.back || !photos.left || !photos.right) {
      Alert.alert('Required', 'Please take photos of all 4 sides of the car.');
      return;
    }

    // ✅ UPDATE STATUS TO ACTIVE
    try {
      await bookingService.updateBookingStatus(bookingId, 'active');
      
      Alert.alert(
        'Trip Started! 🚀',
        'The car is now active. Drive safely!',
        [
          {
            text: "Let's Go",
            onPress: () => {
              // Navigate back to trip details
              router.replace(`/trip/${bookingId}`); 
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error starting trip:', error);
    }
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
        <Text style={styles.headerTitle}>Pre-Trip Condition</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Please take clear photos of the car from all 4 sides to document its condition before the trip starts.
          </Text>
        </View>

        <View style={styles.grid}>
          {renderPhotoBox('front', 'Front View')}
          {renderPhotoBox('back', 'Back View')}
          {renderPhotoBox('left', 'Left Side')}
          {renderPhotoBox('right', 'Right Side')}
        </View>

        <Button
          title="Confirm & Start Trip"
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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
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