// app/(host)/earnings.jsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import walletService from '../../src/api/services/walletService';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

const { width } = Dimensions.get('window');

export default function EarningsScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const balanceRes = await walletService.getBalance();
    const txnRes = await walletService.getTransactions();
    if (balanceRes.success) setBalance(balanceRes.data.balance);
    if (txnRes.success) setTransactions(txnRes.data);
  };

  // Mock Chart Data (Visual Bars)
  const weeklyData = [40, 60, 30, 80, 50, 90, 70]; // Percentage height

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Earnings</Text>
          <Text style={styles.balanceAmount}>Rs. {balance}</Text>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Mock Chart (CSS Bars) */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>
          <View style={styles.barChart}>
            {weeklyData.map((height, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.bar, { height: `${height}%` }]} />
                <Text style={styles.dayText}>{['M','T','W','T','F','S','S'][index]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Driven</Text>
          </View>
        </View>

        {/* Recent History */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {transactions.slice(0, 5).map((txn) => (
          <View key={txn.id} style={styles.txnRow}>
            <View style={styles.txnLeft}>
              <Text style={styles.txnTitle}>{txn.description}</Text>
              <Text style={styles.txnDate}>{new Date(txn.date).toLocaleDateString()}</Text>
            </View>
            <Text style={[
              styles.txnAmount,
              { color: txn.type === 'credit' ? COLORS.success : COLORS.textPrimary }
            ]}>
              +{txn.amount}
            </Text>
          </View>
        ))}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  content: {
    padding: SPACING.lg,
  },
  balanceCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  withdrawButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  withdrawText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 150,
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
  },
  barWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    marginBottom: SPACING.xs,
  },
  dayText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  txnTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  txnDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  txnAmount: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
});