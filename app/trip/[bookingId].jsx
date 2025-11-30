// app/trip/[bookingId].jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useCameraPermissions } from "expo-camera"; // ✅ FIXED IMPORT
import bookingService from "../../src/api/services/bookingService";
import Loader from "../../src/components/common/Loader";
import Button from "../../src/components/common/Button";
import { useAuth } from "../../src/hooks/useAuth";
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from "../../src/config/theme";

export default function TripDetailScreen() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams();
  const { user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  // Security State
  const [securityStep, setSecurityStep] = useState("verify");
  const [verifying, setVerifying] = useState(false);

  // ✅ FIXED HOOK USAGE
  const [permission, requestPermission] = useCameraPermissions();

  // Safely check if booking exists
  const isHost =
    user?.role === "host" || (booking && booking.host?.id === user?.id);

  useEffect(() => {
    if (bookingId) loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(bookingId);
      if (response.success) setBooking(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load trip details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    if (isHost) {
      router.push({
        pathname: "/trip/scan-renter",
        params: { bookingId: booking.id },
      });
    } else {
      // ✅ Request permission if not granted
      if (!permission?.granted) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert(
            "Permission Required",
            "Camera access is needed for biometric verification."
          );
          return;
        }
      }
      setSecurityStep("verify");
      setShowQRModal(true);
    }
  };

  // Mock Face Verification
  const handleVerifyFace = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setSecurityStep("qr");
    }, 2500);
  };

  const handleEndTrip = () => {
    router.push({
      pathname: "/trip/condition-check-after",
      params: { bookingId: booking.id },
    });
  };

  const handleTracking = () => {
    router.push({
      pathname: "/tracking/live-map",
      params: { bookingId: booking.id },
    });
  };

  if (loading) return <Loader fullScreen text="Loading trip details..." />;

  if (!booking)
    return (
      <View style={styles.errorContainer}>
        <Text>Trip not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.statusBanner,
            { backgroundColor: getStatusColor(booking.status) + "15" },
          ]}
        >
          <Ionicons
            name={getStatusIcon(booking.status)}
            size={24}
            color={getStatusColor(booking.status)}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(booking.status) },
            ]}
          >
            {getStatusMessage(booking.status)}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.carCard}>
            <Image
              source={{ uri: booking.car?.image }}
              style={styles.carImage}
            />
            <View style={styles.carInfo}>
              <Text style={styles.carTitle}>
                {booking.car?.make} {booking.car?.model}
              </Text>
              <Text style={styles.plateNumber}>{booking.car?.plateNumber}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: SPACING.md,
            }}
          >
            <Text style={styles.sectionTitle}>
              {isHost ? "Renter" : "Host"}
            </Text>
            {/* Host Rating Display */}
            {!isHost && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.warning + "15",
                  padding: 4,
                  borderRadius: 4,
                }}
              >
                <Ionicons name="star" size={14} color={COLORS.warning} />
                <Text
                  style={{
                    fontWeight: "bold",
                    marginLeft: 4,
                    fontSize: 12,
                    color: COLORS.textPrimary,
                  }}
                >
                  4.9
                </Text>
              </View>
            )}
          </View>

          <View style={styles.personCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(isHost ? booking.renter?.name : booking.host?.name)?.charAt(
                  0
                ) || "?"}
              </Text>
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>
                {isHost ? booking.renter?.name : booking.host?.name}
              </Text>
              <Text style={styles.personPhone}>
                {isHost ? booking.renter?.phone : booking.host?.phone}
              </Text>
              {/* Added verified badge */}
              <Text
                style={{ fontSize: 10, color: COLORS.success, marginTop: 2 }}
              >
                ✅ Identity Verified
              </Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <Ionicons name="call" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actions}>
          {booking.status === "upcoming" && (
            <Button
              title={isHost ? "Scan QR to Start" : "Verify & Start Trip"}
              onPress={handleStartTrip}
              icon={
                <Ionicons
                  name={isHost ? "qr-code" : "scan-circle"}
                  size={20}
                  color={COLORS.white}
                  style={{ marginRight: 8 }}
                />
              }
            />
          )}
          {booking.status === "active" && (
            <>
              {isHost && (
                <Button
                  title="Track Car"
                  variant="secondary"
                  onPress={handleTracking}
                  style={{ marginBottom: SPACING.md }}
                  icon={
                    <Ionicons
                      name="location"
                      size={20}
                      color={COLORS.primary}
                      style={{ marginRight: 8 }}
                    />
                  }
                />
              )}
              <Button
                title={isHost ? "End Trip (Scan QR)" : "End Trip (Show QR)"}
                onPress={handleEndTrip}
                style={{ backgroundColor: COLORS.error }}
              />
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {securityStep === "verify" ? (
              <View style={styles.securityStep}>
                <Text style={styles.modalTitle}>Identity Check 🔒</Text>
                <Text style={styles.modalSubtitle}>
                  To prevent theft, verify your face.
                </Text>
                <View style={styles.cameraPreview}>
                  {verifying ? (
                    <View style={styles.scanningState}>
                      <ActivityIndicator size="large" color={COLORS.success} />
                      <Text style={styles.scanningText}>Verifying...</Text>
                    </View>
                  ) : (
                    <View style={styles.faceFrame}>
                      <Ionicons
                        name="person"
                        size={80}
                        color={COLORS.gray300}
                      />
                    </View>
                  )}
                </View>
                <Button
                  title="Scan Face"
                  onPress={handleVerifyFace}
                  disabled={verifying}
                  style={{ width: "100%" }}
                />
              </View>
            ) : (
              <View style={styles.securityStep}>
                <View style={styles.verifiedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.success}
                  />
                  <Text style={styles.verifiedText}>Identity Verified</Text>
                </View>
                <Text style={styles.modalTitle}>Digital Key</Text>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={JSON.stringify({
                      bookingId: booking.id,
                      action: "start_trip",
                    })}
                    size={200}
                  />
                </View>
                <Button
                  title="Close"
                  onPress={() => setShowQRModal(false)}
                  variant="outline"
                  style={{ marginTop: SPACING.xl, width: "100%" }}
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ... (Helper functions getStatusColor, etc. remain same)
const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return COLORS.info;
    case "active":
      return COLORS.success;
    case "completed":
      return COLORS.gray500;
    case "cancelled":
      return COLORS.error;
    default:
      return COLORS.primary;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "upcoming":
      return "time";
    case "active":
      return "car-sport";
    case "completed":
      return "checkmark-circle";
    case "cancelled":
      return "close-circle";
    default:
      return "information-circle";
  }
};

const getStatusMessage = (status) => {
  switch (status) {
    case "upcoming":
      return "Trip Scheduled";
    case "active":
      return "Trip in Progress";
    case "completed":
      return "Trip Completed";
    case "cancelled":
      return "Trip Cancelled";
    default:
      return status;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  statusText: { fontSize: FONT_SIZES.md, fontWeight: "bold" },
  section: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  carCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  carImage: {
    width: 80,
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.gray200,
  },
  carInfo: { marginLeft: SPACING.md, flex: 1 },
  carTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  plateNumber: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  personCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: "bold",
    color: COLORS.white,
  },
  personInfo: { flex: 1, marginLeft: SPACING.md },
  personName: {
    fontSize: FONT_SIZES.md,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  personPhone: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.success,
    justifyContent: "center",
    alignItems: "center",
  },
  actions: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
    width: "100%",
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.xl,
  },
  qrContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Security Styles
  securityStep: { width: "100%", alignItems: "center" },
  cameraPreview: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.gray50,
    borderRadius: 100,
    marginBottom: SPACING.lg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: COLORS.gray200,
    overflow: "hidden",
  },
  faceFrame: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  scanningState: { alignItems: "center", gap: 10 },
  scanningText: { color: COLORS.success, fontWeight: "bold" },
  verifiedBadge: {
    flexDirection: "row",
    backgroundColor: COLORS.success + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
    alignItems: "center",
    gap: 4,
  },
  verifiedText: { color: COLORS.success, fontWeight: "bold", fontSize: 12 },
});
