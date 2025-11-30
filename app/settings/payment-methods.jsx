// app/settings/payment-methods.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function PaymentMethodsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="card" size={24} color={COLORS.primary} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardType}>Visa</Text>
            <Text style={styles.cardNumber}>**** **** **** 4242</Text>
          </View>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
          <Text style={styles.addText}>Add New Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
  content: { padding: SPACING.lg },
  card: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.gray200, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.md },
  cardInfo: { flex: 1, marginLeft: SPACING.md },
  cardType: { fontWeight: 'bold' },
  cardNumber: { color: COLORS.textSecondary },
  addButton: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed', borderRadius: BORDER_RADIUS.md, justifyContent: 'center' },
  addText: { marginLeft: SPACING.sm, color: COLORS.primary, fontWeight: '600' },
});