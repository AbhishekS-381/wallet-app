'use strict';

const { v4: uuidv4 } = require('uuid');
const database = require('../models/database');
const { round4, getCurrentDate } = require('../utils/util');
const { collectionName, transactionTypes } = require('../constants');

async function getWallet(id) {
  const wallet = await database.getDb().collection(collectionName.wallet).findOne({ _id: id });

  // Convert date strings to Date objects for API consumers
  // This ensures that the dates are in a format that can be easily consumed by frontend applications
  if (wallet) {
    wallet.created_at = new Date(wallet.created_at);
    wallet.updated_at = new Date(wallet.updated_at);
  }
  return wallet;
}

async function createWallet({ name, balance }) {
  try {
    const _id = uuidv4();
    // Ensure balance is double with up to 4 decimals
    const numericBalance = round4(balance);
    const now = getCurrentDate(); // Store as string
    const wallet = {
      _id,
      name,
      balance: numericBalance,
      created_at: now,
      updated_at: now,
    };

    await database.getDb().collection(collectionName.wallet).insertOne(wallet);
    let transactionId = null;
    // If initial balance > 0, create a transaction for setup
    if (numericBalance > 0) {
      const nowTx = now;
      const transaction = {
        _id: uuidv4(),
        walletId: _id,
        amount: numericBalance,
        balance: numericBalance,
        description: 'Initial wallet setup',
        type: transactionTypes.CREDIT,
        transaction_time_stamp: nowTx,
      };
      await database.getDb().collection(collectionName.transaction).insertOne(transaction);
      transactionId = transaction._id;
    }

    return {
      id: _id,
      balance: numericBalance,
      transactionId,
      name,
      date: new Date(now),
    };
  } catch (err) {
    if (err.code === 121 || (err.message && err.message.includes('Document failed validation'))) {
      throw new Error('Invalid wallet data. Please check your input.');
    }
    throw err;
  }
}

module.exports = {
  getWallet,
  createWallet,
};
