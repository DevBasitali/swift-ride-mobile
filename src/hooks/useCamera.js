import { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export const useCamera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      if (Platform.OS !== 'web') {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === 'granted');
      }
    } catch (error) {
      console.error('Permission error:', error);
      setHasCameraPermission(false);
      setHasGalleryPermission(false);
    }
  };

  const takePicture = async (cameraRef) => {
    if (!cameraRef) {
      console.log('Camera ref is null');
      return null;
    }

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      return photo;
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
      return null;
    }
  };

  const pickImageFromGallery = async () => {
    if (!hasGalleryPermission) {
      Alert.alert('Permission Required', 'Please grant gallery access');
      return null;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images, // ✅ Fixed here
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        return result.assets[0];
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
      return null;
    }
  };

  return {
    hasCameraPermission,
    hasGalleryPermission,
    requestPermissions,
    takePicture,
    pickImageFromGallery,
  };
};