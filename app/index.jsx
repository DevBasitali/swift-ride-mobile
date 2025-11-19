import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions,
  StatusBar 
} from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const index = () => {
  // Sample popular cars for preview
  const popularCars = [
    { id: 1, name: 'Tesla Model S', price: 150, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400' },
    { id: 2, name: 'Porsche Cayenne', price: 200, image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400' },
    { id: 3, name: 'BMW X5', price: 180, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400' },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header with Gradient */}
        <LinearGradient
          colors={['#FF6B6B', '#FF8E53', '#FF6B9D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />

          <View style={styles.headerContent}>
            {/* Logo container with glow effect */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.logoGradient}
              >
                <Ionicons name="car-sport" size={60} color="#fff" />
              </LinearGradient>
            </View>
            
            <Text style={styles.headerTitle}>CarRental</Text>
            <Text style={styles.headerSubtitle}>Find Your Perfect Ride</Text>
            
            {/* Quick stats in header */}
            <View style={styles.headerStats}>
              <View style={styles.headerStatItem}>
                <Text style={styles.headerStatNumber}>500+</Text>
                <Text style={styles.headerStatLabel}>Cars</Text>
              </View>
              <View style={styles.headerStatDivider} />
              <View style={styles.headerStatItem}>
                <Text style={styles.headerStatNumber}>4.8★</Text>
                <Text style={styles.headerStatLabel}>Rating</Text>
              </View>
              <View style={styles.headerStatDivider} />
              <View style={styles.headerStatItem}>
                <Text style={styles.headerStatNumber}>24/7</Text>
                <Text style={styles.headerStatLabel}>Support</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Hero Section with gradient background */}
        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <Ionicons name="flash" size={12} color="#FF6B6B" />
            <Text style={styles.badgeText}>Special Offer</Text>
          </View>
          <Text style={styles.heroTitle}>Premium Cars,{'\n'}Unbeatable Prices</Text>
          <Text style={styles.heroText}>
            Experience luxury and comfort with our wide selection of{'\n'}
            premium vehicles at competitive rates
          </Text>
        </View>

        {/* Enhanced Features with colored backgrounds */}
        <View style={styles.featuresContainer}>
          <View style={[styles.featureCard, { backgroundColor: '#FFF5F5' }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#FFE5E5' }]}>
              <Ionicons name="shield-checkmark" size={32} color="#FF6B6B" />
            </View>
            <Text style={styles.featureTitle}>Verified Cars</Text>
            <Text style={styles.featureText}>All vehicles are fully verified and insured</Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: '#F0FFFE' }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#D4FBF9' }]}>
              <Ionicons name="cash-outline" size={32} color="#4ECDC4" />
            </View>
            <Text style={styles.featureTitle}>Best Prices</Text>
            <Text style={styles.featureText}>Competitive rates guaranteed daily</Text>
          </View>

          <View style={[styles.featureCard, { backgroundColor: '#FFFEF0' }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#FFF9D4' }]}>
              <Ionicons name="time-outline" size={32} color="#FFD93D" />
            </View>
            <Text style={styles.featureTitle}>24/7 Support</Text>
            <Text style={styles.featureText}>Round the clock customer service</Text>
          </View>
        </View>

        {/* Popular Cars Section */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Popular Cars</Text>
              <Text style={styles.sectionSubtitle}>Most rented this week</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/cars')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularCarsScroll}
          >
            {popularCars.map((car) => (
              <TouchableOpacity 
                key={car.id} 
                style={styles.popularCarCard}
                onPress={() => router.push('/cars')}
              >
                <Image 
                  source={{ uri: car.image }} 
                  style={styles.popularCarImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.popularCarGradient}
                >
                  <Text style={styles.popularCarName}>{car.name}</Text>
                  <View style={styles.popularCarPrice}>
                    <Text style={styles.popularCarPriceText}>${car.price}</Text>
                    <Text style={styles.popularCarPriceLabel}>/day</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>Rent a car in 3 easy steps</Text>

          <View style={styles.stepsContainer}>
            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepIconContainer}>
                <Ionicons name="search" size={28} color="#FF6B6B" />
              </View>
              <Text style={styles.stepTitle}>Choose a Car</Text>
              <Text style={styles.stepText}>Browse our collection and pick your favorite</Text>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepIconContainer}>
                <Ionicons name="calendar" size={28} color="#4ECDC4" />
              </View>
              <Text style={styles.stepTitle}>Book & Pay</Text>
              <Text style={styles.stepText}>Select dates and complete secure payment</Text>
            </View>

            <View style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepIconContainer}>
                <Ionicons name="car-sport" size={28} color="#FFD93D" />
              </View>
              <Text style={styles.stepTitle}>Drive Away</Text>
              <Text style={styles.stepText}>Pick up your car and enjoy the ride</Text>
            </View>
          </View>
        </View>

        {/* Enhanced CTA Button with Pulse Effect */}
        <View style={styles.ctaContainer}>
          <View style={styles.ctaPulse} />
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => router.push('/cars')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaButtonText}>Browse All Cars</Text>
              <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Testimonials Section */}
        <View style={styles.testimonialsSection}>
          <Text style={styles.sectionTitle}>What Our Customers Say</Text>
          <Text style={styles.sectionSubtitle}>Real reviews from real customers</Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialsScroll}
          >
            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatar}>
                  <Text style={styles.testimonialAvatarText}>JD</Text>
                </View>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>John Doe</Text>
                  <View style={styles.testimonialRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star" size={14} color="#FFD93D" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "Amazing service! The car was in perfect condition and the booking process was super smooth."
              </Text>
            </View>

            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatar}>
                  <Text style={styles.testimonialAvatarText}>SM</Text>
                </View>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>Sarah Miller</Text>
                  <View style={styles.testimonialRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star" size={14} color="#FFD93D" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "Best car rental experience ever! Great prices and excellent customer support."
              </Text>
            </View>

            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatar}>
                  <Text style={styles.testimonialAvatarText}>MJ</Text>
                </View>
                <View style={styles.testimonialInfo}>
                  <Text style={styles.testimonialName}>Mike Johnson</Text>
                  <View style={styles.testimonialRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star" size={14} color="#FFD93D" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "Highly recommend! Professional service and premium quality cars at great rates."
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Stats Section with gradient cards */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsGradient}
          >
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>500+</Text>
                <Text style={styles.statLabel}>Cars Available</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>10K+</Text>
                <Text style={styles.statLabel}>Happy Customers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>City Locations</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Enhanced Footer */}
        <View style={styles.footer}>
          <View style={styles.footerTop}>
            <View style={styles.footerBrand}>
              <Ionicons name="car-sport" size={32} color="#FF6B6B" />
              <Text style={styles.footerBrandText}>CarRental</Text>
            </View>
            <Text style={styles.footerTagline}>Your journey, our passion</Text>
          </View>

          <View style={styles.footerLinks}>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Privacy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSocial}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={20} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
            </TouchableOpacity>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerText}>© 2024 CarRental. All rights reserved.</Text>
            <Text style={styles.footerSubtext}>Made with ❤️ for car enthusiasts</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Enhanced Header
  header: {
    paddingTop: 60,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 20,
    left: -30,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 100,
    left: 50,
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 24,
  },
  headerStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginTop: 8,
  },
  headerStatItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Hero Section
  heroSection: {
    padding: 32,
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 40,
  },
  heroText: {
    fontSize: 15,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Enhanced Features
  featuresContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 11,
    color: '#636E72',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Popular Cars Section
  popularSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  popularCarsScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  popularCarCard: {
    width: 200,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  popularCarImage: {
    width: '100%',
    height: '100%',
  },
  popularCarGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  popularCarName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  popularCarPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  popularCarPriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  popularCarPriceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },

  // How It Works
  howItWorksSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  stepsContainer: {
    marginTop: 20,
    gap: 16,
  },
  stepCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  stepNumber: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  stepIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
  },

  // Enhanced CTA
  ctaContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
  },
  ctaPulse: {
    position: 'absolute',
    width: width - 48,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    opacity: 0.2,
    transform: [{ scale: 1.05 }],
  },
  ctaButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Testimonials
  testimonialsSection: {
    marginBottom: 32,
    paddingLeft: 24,
  },
  testimonialsScroll: {
    paddingRight: 24,
    gap: 16,
    marginTop: 16,
  },
  testimonialCard: {
    width: 280,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testimonialAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  testimonialInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 4,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: '#636E72',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Stats Section
  statsSection: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statsGradient: {
    padding: 24,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Enhanced Footer
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerTop: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  footerBrandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  footerTagline: {
    fontSize: 14,
    color: '#636E72',
    fontStyle: 'italic',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 20,
  },
  footerLink: {
    paddingVertical: 4,
  },
  footerLinkText: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
  },
  footerSocial: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  footerBottom: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 12,
    color: '#B2BEC3',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 11,
    color: '#DFE6E9',
  },
});