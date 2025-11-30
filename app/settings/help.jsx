// app/settings/help.jsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

const FAQS = [
  { q: 'How do I start a trip?', a: 'Go to your bookings, select the trip, and scan the QR code provided by the host.' },
  { q: 'What if I am late?', a: 'You may be charged a late fee. Please contact the host immediately.' },
  { q: 'How does insurance work?', a: 'Every trip is covered by our basic insurance plan.' },
];

export default function HelpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.contactBox}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:1234567890')}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>+1 (234) 567-890</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:support@swiftride.com')}>
            <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>support@swiftride.com</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>FAQs</Text>
        {FAQS.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
  content: { padding: SPACING.lg },
  contactBox: { backgroundColor: COLORS.gray50, padding: SPACING.lg, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.xl },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm },
  contactText: { marginLeft: SPACING.sm, fontSize: FONT_SIZES.md, color: COLORS.textPrimary },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', marginBottom: SPACING.md },
  faqItem: { marginBottom: SPACING.lg },
  question: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: 4 },
  answer: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
});