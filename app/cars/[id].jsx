// app/cars/[id].jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import carService from "../../src/api/services/carService";
import Button from "../../src/components/common/Button";
import Loader from "../../src/components/common/Loader";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../../src/config/theme";
import { useAuth } from "../../src/hooks/useAuth";

const { width } = Dimensions.get("window");

export default function CarDetailScreen() {
  const router = useRouter();
  const { id, mode } = useLocalSearchParams();
  const { user } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isHostMode = mode !== "renter" && car?.hostId === user?.id;

  useEffect(() => {
    loadCarDetails();
  }, [id]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      const response = await carService.getCarById(id);
      if (response.success) {
        setCar(response.data);
      }
    } catch (error) {
      console.error("Error loading car:", error);
      Alert.alert("Error", "Failed to load car details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // ✅ FIX: Direct string path for navigation
    router.push(`/booking/${carId}`);
  };

  const handleEdit = () => {
    router.push(`/cars/edit-car?carId=${id}`);
  };

  if (loading) return <Loader fullScreen text="Loading car details..." />;

  if (!car)
    return (
      <View style={styles.errorContainer}>
        <Text>Car not found</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {car.photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo }}
                style={styles.carImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.imageIndicators}>
            {car.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.indicatorActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.carTitle}>
                {car.make} {car.model}
              </Text>
              <Text style={styles.carSubtitle}>
                {car.year} • {car.color}
              </Text>
            </View>
            <View>
              <Text style={styles.price}>Rs. {car.pricePerHour}</Text>
              <Text style={styles.priceUnit}>/ hour</Text>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons
                name="speedometer-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.statLabel}>{car.transmission}</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="water-outline" size={24} color={COLORS.primary} />
              <Text style={styles.statLabel}>{car.fuelType}</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons
                name="people-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.statLabel}>{car.seats} Seats</Text>
            </View>
          </View>

          {/* Host Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hosted by</Text>
            <View style={styles.hostBox}>
              <View style={styles.hostAvatar}>
                <Text style={styles.hostAvatarText}>H</Text>
              </View>
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>SwiftRide Host</Text>
                <View style={styles.hostStats}>
                  <Ionicons name="star" size={14} color={COLORS.warning} />
                  <Text style={styles.hostStatsText}>4.9 • Verified</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationBox}>
              <Ionicons name="location" size={24} color={COLORS.primary} />
              <Text style={styles.locationText}>{car.location?.address}</Text>
            </View>
          </View>

          {/* Action Button */}
          <View style={styles.footerSpace} />
        </View>
      </ScrollView>

      {/* Sticky Footer Button */}
      <View style={styles.footer}>
        {isHostMode ? (
          <Button
            title="Edit Car Details"
            onPress={handleEdit}
            variant="secondary"
          />
        ) : (
          <Button
            title="Book Now"
            onPress={handleBookNow}
            style={styles.bookButton}
            icon={
              <Ionicons
                name="calendar"
                size={20}
                color={COLORS.white}
                style={{ marginRight: 8 }}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 300,
    width: "100%",
    backgroundColor: COLORS.gray200,
  },
  carImage: { width: width, height: 300 },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  indicatorActive: { backgroundColor: COLORS.white, width: 24 },
  content: { padding: SPACING.lg },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },
  carTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  carSubtitle: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  price: { fontSize: FONT_SIZES.xl, fontWeight: "bold", color: COLORS.primary },
  priceUnit: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: "right",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  statBox: { alignItems: "center" },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    marginBottom: SPACING.sm,
  },
  hostBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  hostAvatarText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: FONT_SIZES.lg,
  },
  hostInfo: { marginLeft: SPACING.md },
  hostName: { fontWeight: "bold", fontSize: FONT_SIZES.md },
  hostStats: { flexDirection: "row", alignItems: "center" },
  hostStatsText: {
    marginLeft: 4,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  locationText: {
    marginLeft: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    flex: 1,
  },
  footerSpace: { height: 80 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingBottom: SPACING.xl,
  },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
