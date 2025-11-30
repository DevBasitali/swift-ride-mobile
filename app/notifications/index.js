// app/notifications/index.jsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZES } from "../../src/config/theme";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "Trip Started",
    body: "Your trip with Toyota Corolla has started.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    title: "Payment Received",
    body: "You received Rs. 4500 for trip #BK101.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "3",
    title: "Booking Confirmed",
    body: "Your booking for Honda Civic is confirmed.",
    time: "1 day ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.read && styles.unreadItem]}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.read ? "notifications-outline" : "notifications"}
                size={24}
                color={COLORS.primary}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            {!item.read && <View style={styles.dot} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

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
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: "bold" },
  list: { padding: SPACING.md },
  item: {
    flexDirection: "row",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    alignItems: "center",
  },
  unreadItem: { backgroundColor: COLORS.primary + "05" },
  iconContainer: { marginRight: SPACING.md },
  textContainer: { flex: 1 },
  title: { fontSize: FONT_SIZES.md, fontWeight: "bold", marginBottom: 2 },
  body: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  time: { fontSize: 10, color: COLORS.textTertiary },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
