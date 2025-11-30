// app/(renter)/wallet.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import walletService from '../../src/api/services/walletService';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/InputField';
import Loader from '../../src/components/common/Loader';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../src/config/theme';

export default function WalletScreen() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [amount, setAmount] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadWalletData();
    }, [])
  );

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const balanceRes = await walletService.getBalance();
      const txnRes = await walletService.getTransactions();

      if (balanceRes.success) setBalance(balanceRes.data.balance);
      if (txnRes.success) setTransactions(txnRes.data);
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTopUp = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const response = await walletService.addFunds(amount);
      if (response.success) {
        Alert.alert('Success', 'Funds added successfully!');
        setShowTopUp(false);
        setAmount('');
        loadWalletData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const renderTransaction = (txn) => (
    <View key={txn.id} style={styles.txnCard}>
      <View style={styles.txnIconContainer}>
        <Ionicons 
          name={txn.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'} 
          size={24} 
          color={txn.type === 'credit' ? COLORS.success : COLORS.error} 
        />
      </View>
      <View style={styles.txnInfo}>
        <Text style={styles.txnTitle}>{txn.description}</Text>
        <Text style={styles.txnDate}>{new Date(txn.date).toLocaleDateString()}</Text>
      </View>
      <Text style={[
        styles.txnAmount,
        { color: txn.type === 'credit' ? COLORS.success : COLORS.error }
      ]}>
        {txn.type === 'credit' ? '+' : '-'} Rs. {txn.amount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadWalletData();
          }} />
        }
      >
        {/* Header */}
        <Text style={styles.headerTitle}>My Wallet</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>Rs. {balance}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowTopUp(true)}
            >
              <Ionicons name="add-circle" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="card" size={24} color={COLORS.white} />
              <Text style={styles.actionText}>Cards</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {loading && !refreshing ? (
          <Loader />
        ) : transactions.length > 0 ? (
          transactions.map(renderTransaction)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Top Up Modal */}
      <Modal
        visible={showTopUp}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTopUp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Money</Text>
            <Input
              placeholder="Amount (Rs.)"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              icon="cash-outline"
            />
            <View style={styles.modalButtons}>
              <Button 
                title="Cancel" 
                onPress={() => setShowTopUp(false)} 
                variant="outline"
                style={{ flex: 1, marginRight: 10 }}
              />
              <Button 
                title="Confirm" 
                onPress={handleTopUp}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  balanceAmount: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  balanceActions: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  txnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray50,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  txnIconContainer: {
    marginRight: SPACING.md,
  },
  txnInfo: {
    flex: 1,
  },
  txnTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  txnDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  emptyText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});