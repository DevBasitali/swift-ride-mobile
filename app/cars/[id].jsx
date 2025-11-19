import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { carsData } from '../../src/data/carsData';

const { width } = Dimensions.get('window');

const CarDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const car = carsData.find(c => c.id === id);

  if (!car) {
    return (
      <View style={styles.errorContainer}>
        <Text>Car not found</Text>
      </View>
    );
  }

  const handleRentNow = () => {
    Alert.alert(
      'Rent Car',
      `Do you want to rent ${car.brand} ${car.name} for $${car.pricePerDay}/day?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => Alert.alert('Success', 'Booking confirmed! 🎉')
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#2D3436" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Car Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: car.image }} 
              style={styles.carImage}
              resizeMode="cover"
            />
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <View style={styles.titleSection}>
              <View>
                <Text style={styles.brand}>{car.brand}</Text>
                <Text style={styles.name}>{car.name}</Text>
              </View>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={20} color="#FFD93D" />
                <Text style={styles.rating}>{car.rating}</Text>
              </View>
            </View>

            {/* Specs */}
            <View style={styles.specsContainer}>
              <View style={styles.specCard}>
                <Ionicons name="speedometer-outline" size={28} color="#FF6B6B" />
                <Text style={styles.specLabel}>Top Speed</Text>
                <Text style={styles.specValue}>{car.topSpeed}</Text>
              </View>
              <View style={styles.specCard}>
                <Ionicons name="flash-outline" size={28} color="#4ECDC4" />
                <Text style={styles.specLabel}>0-100 km/h</Text>
                <Text style={styles.specValue}>{car.acceleration}</Text>
              </View>
              <View style={styles.specCard}>
                <Ionicons name="build-outline" size={28} color="#FFD93D" />
                <Text style={styles.specLabel}>Power</Text>
                <Text style={styles.specValue}>{car.power}</Text>
              </View>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresGrid}>
                <View style={styles.featureItem}>
                  <Ionicons name="people-outline" size={20} color="#636E72" />
                  <Text style={styles.featureText}>{car.seats} Seats</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="cog-outline" size={20} color="#636E72" />
                  <Text style={styles.featureText}>{car.transmission}</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="water-outline" size={20} color="#636E72" />
                  <Text style={styles.featureText}>{car.fuel}</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="snow-outline" size={20} color="#636E72" />
                  <Text style={styles.featureText}>AC</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="bluetooth-outline" size={20} color="#636E72" />
                  <Text style={styles.featureText}>Bluetooth</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="navigate-outline" size={20} color="#636E72" />
                  <Text style={styles.featureText}>GPS</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{car.description}</Text>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pick-up Location</Text>
              <View style={styles.locationCard}>
                <Ionicons name="location" size={24} color="#FF6B6B" />
                <Text style={styles.locationText}>{car.location}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.price}>${car.pricePerDay}<Text style={styles.priceUnit}>/day</Text></Text>
          </View>
          <TouchableOpacity 
            style={styles.rentButton}
            onPress={handleRentNow}
          >
            <Text style={styles.rentButtonText}>Rent Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default CarDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: width,
    height: 300,
    backgroundColor: '#E8E8E8',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  brand: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
  },
  specsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  specCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  specLabel: {
    fontSize: 11,
    color: '#B2BEC3',
    marginTop: 8,
  },
  specValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 12,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureText: {
    fontSize: 14,
    color: '#636E72',
  },
  description: {
    fontSize: 15,
    color: '#636E72',
    lineHeight: 24,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3436',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#DFE6E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: '#B2BEC3',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  priceUnit: {
    fontSize: 16,
    color: '#636E72',
  },
  rentButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  rentButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});