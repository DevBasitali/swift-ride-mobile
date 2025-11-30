// src/api/services/walletService.js

import { sleep } from '../../utils/helpers';

// Mock transaction history
const MOCK_TRANSACTIONS = [
  {
    id: 'TXN101',
    type: 'credit', // credit (earning) or debit (payment)
    amount: 4500,
    description: 'Trip earning: Toyota Corolla',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: 'completed'
  },
  {
    id: 'TXN102',
    type: 'debit',
    amount: 1500,
    description: 'Wallet Withdrawal',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'completed'
  }
];

class WalletService {
  // Get wallet balance
  async getBalance(userId) {
    console.log('💰 Mock Get Balance:', userId);
    await sleep(500);
    
    // Calculate balance from transactions
    const balance = MOCK_TRANSACTIONS.reduce((acc, txn) => {
      return txn.type === 'credit' ? acc + txn.amount : acc - txn.amount;
    }, 0);

    return {
      success: true,
      data: {
        balance: balance,
        currency: 'Rs.'
      }
    };
  }

  // Get transaction history
  async getTransactions(userId) {
    console.log('📜 Mock Get Transactions:', userId);
    await sleep(800);
    
    return {
      success: true,
      data: MOCK_TRANSACTIONS
    };
  }

  // Add funds (Top up)
  async addFunds(amount) {
    console.log('➕ Mock Add Funds:', amount);
    await sleep(1500);

    const newTxn = {
      id: `TXN${Date.now()}`,
      type: 'credit',
      amount: parseFloat(amount),
      description: 'Wallet Top Up',
      date: new Date().toISOString(),
      status: 'completed'
    };

    MOCK_TRANSACTIONS.unshift(newTxn);

    return {
      success: true,
      message: 'Funds added successfully',
      data: newTxn
    };
  }

  // Withdraw funds
  async withdrawFunds(amount) {
    console.log('➖ Mock Withdraw Funds:', amount);
    await sleep(1500);

    const newTxn = {
      id: `TXN${Date.now()}`,
      type: 'debit',
      amount: parseFloat(amount),
      description: 'Withdrawal to Bank Account',
      date: new Date().toISOString(),
      status: 'completed'
    };

    MOCK_TRANSACTIONS.unshift(newTxn);

    return {
      success: true,
      message: 'Withdrawal request processed',
      data: newTxn
    };
  }
  
  // Process Trip Payment (Internal use)
  async processTripPayment(tripId, amount) {
    console.log('🚗 Mock Trip Payment:', amount);
    
    const newTxn = {
      id: `TXN${Date.now()}`,
      type: 'credit',
      amount: parseFloat(amount),
      description: `Trip Earnings: ${tripId}`,
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    MOCK_TRANSACTIONS.unshift(newTxn);
    return true;
  }
}

export default new WalletService();