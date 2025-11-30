// app/(renter)/home.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native"; // ✅ Crucial for map fix
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/hooks/useAuth";
import carService from "../../src/api/services/carService";
import CarCard from "../../src/components/car/CarCard";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../../src/config/theme";

const { height } = Dimensions.get("window");

export default function RenterHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ This hook tells us if the screen is currently visible
  const isFocused = useIsFocused();

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);

  const [region, setRegion] = useState({
    latitude: 31.5204, // Default: Lahore
    longitude: 74.3587,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Load cars when screen becomes focused
  useEffect(() => {
    if (isFocused) {
      loadCars();
    }
  }, [isFocused]);

  // Filter cars when search query changes
  useEffect(() => {
    filterCars();
  }, [searchQuery, cars]);

  const loadCars = async () => {
    try {
      // Don't set loading to true if we already have cars (prevents flicker)
      if (cars.length === 0) setLoading(true);

      const response = await carService.getAllCars();

      if (response.success) {
        setCars(response.data);
        setFilteredCars(response.data);
      }
    } catch (error) {
      console.error("Error loading cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    if (!searchQuery.trim()) {
      setFilteredCars(cars);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = cars.filter(
      (car) =>
        car.make.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.color.toLowerCase().includes(query) ||
        car.location?.address.toLowerCase().includes(query)
    );

    setFilteredCars(filtered);
  };

const handleCarPress = (car) => {
  router.push(`/cars/${car.id}?mode=renter`);
};

  const handleMarkerPress = (car) => {
    setSelectedCar(car);
    // Optional: Center map on marker
    setRegion({
      latitude: car.location.lat,
      longitude: car.location.lng,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleFilter = () => {
    router.push("/modal/filter");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || "Renter"} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={COLORS.textPrimary}
            />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.gray400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by make, model, or location..."
            placeholderTextColor={COLORS.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleFilter} style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === "map" && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode("map")}
          >
            <Ionicons
              name="map"
              size={18}
              color={viewMode === "map" ? COLORS.white : COLORS.gray400}
            />
            <Text
              style={[
                styles.viewButtonText,
                viewMode === "map" && styles.viewButtonTextActive,
              ]}
            >
              Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewMode === "list" && styles.viewButtonActive,
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === "list" ? COLORS.white : COLORS.gray400}
            />
            <Text
              style={[
                styles.viewButtonText,
                viewMode === "list" && styles.viewButtonTextActive,
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Count */}
        <Text style={styles.resultsText}>
          {filteredCars.length} {filteredCars.length === 1 ? "car" : "cars"}{" "}
          available
        </Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {viewMode === "map" ? (
          <View style={styles.mapContainer}>
            {/* ✅ CONDITIONAL RENDER: This fixes the blank map issue */}
            {isFocused && (
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation
                showsMyLocationButton
              >
                {filteredCars.map((car) => (
                  <Marker
                    key={car.id}
                    coordinate={{
                      latitude: car.location.lat,
                      longitude: car.location.lng,
                    }}
                    onPress={() => handleMarkerPress(car)}
                  >
                    <View style={styles.markerContainer}>
                      <View style={styles.marker}>
                        <Ionicons
                          name="car-sport"
                          size={20}
                          color={COLORS.white}
                        />
                      </View>
                      <View style={styles.markerPrice}>
                        <Text style={styles.markerPriceText}>
                          ₨{car.pricePerHour}/hr
                        </Text>
                      </View>
                    </View>
                  </Marker>
                ))}
              </MapView>
            )}

            {loading && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}

            {/* Selected Car Bottom Sheet */}
            {selectedCar && (
              <View style={styles.selectedCarSheet}>
                <TouchableOpacity
                  style={styles.sheetCloseButton}
                  onPress={() => setSelectedCar(null)}
                >
                  <Ionicons name="close" size={20} color={COLORS.gray400} />
                </TouchableOpacity>
                <CarCard
                  car={selectedCar}
                  onPress={() => handleCarPress(selectedCar)}
                  showActions={false}
                />
              </View>
            )}
          </View>
        ) : (
          /* List View */
          <FlatList
            data={filteredCars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CarCard
                car={item}
                onPress={() => handleCarPress(item)}
                showActions={false}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !loading && (
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="car-outline"
                    size={80}
                    color={COLORS.gray300}
                  />
                  <Text style={styles.emptyTitle}>No Cars Found</Text>
                  <Text style={styles.emptyText}>
                    Try adjusting your search or filters
                  </Text>
                </View>
              )
            }
          />
        )}
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
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    zIndex: 10, // Ensure header stays above map
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gray100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    marginBottom: SPACING.sm,
  },
  viewButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  viewButtonActive: {
    backgroundColor: COLORS.primary,
  },
  viewButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray400,
    fontWeight: "600",
    marginLeft: SPACING.xs,
  },
  viewButtonTextActive: {
    color: COLORS.white,
  },
  resultsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  contentContainer: {
    flex: 1, // Ensures the content fills the rest of the screen
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: COLORS.gray200, // Fallback color
  },
  map: {
    ...StyleSheet.absoluteFillObject, // ✅ Critical for map to show
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 5,
  },
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  markerPrice: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 4,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  markerPriceText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: "600",
    color: COLORS.primary,
  },
  selectedCarSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === "ios" ? 30 : SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  sheetCloseButton: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
  listContent: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.2,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
});
