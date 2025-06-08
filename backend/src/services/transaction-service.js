'use strict';

const { v4: uuidv4 } = require('uuid');

const database = require('../models/database');
const { round4, getCurrentDate } = require('../utils/util');
const { collectionName, transactionTypes } = require('../constants');

async function getTransactions(walletId, skip = 0, limit = 100, sortBy = 'transaction_time_stamp', sortDir = 'desc') {
  const sort = { [sortBy]: sortDir === 'asc' ? 1 : -1 };
  const transactions = await database.getDb().collection(collectionName.transaction)
    .find({ walletId })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .toArray();

  // Convert date strings to Date objects for API consumers and map to expected response
  return transactions.map(transaction => ({
    id: transaction._id,
    walletId: transaction.walletId,
    amount: transaction.amount,
    balance: transaction.balance,
    description: transaction.description,
    date: new Date(transaction.transaction_time_stamp),
    type: transaction.type,
  }));
}

async function getTransactionCount(walletId) {
  return await database.getDb().collection(collectionName.transaction).countDocuments({ walletId });
}

async function transact(walletId, amount, description) {
  const session = database.getDb().client.startSession();
  let result;
  try {
    await session.withTransaction(async () => {
      // 1. Find the wallet
      const wallet = await database.getDb().collection(collectionName.wallet).findOne({ _id: walletId }, { session });
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      // 2. Calculate and round new balance
      const newBalance = round4(Number(wallet.balance) + round4(amount));
      // 3. Check if new balance is valid
      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }
      // 4. Update the wallet balance
      const updateResult = await database.getDb().collection(collectionName.wallet).updateOne(
        { _id: walletId },
        { $set: { balance: newBalance } },
        { session },
      );
      if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to update wallet balance');
      }
      // 5. Create the transaction
      const now = getCurrentDate();
      const transaction = {
        _id: uuidv4(),
        walletId,
        amount: round4(amount),
        balance: newBalance,
        description,
        type: amount >= 0 ? transactionTypes.CREDIT : transactionTypes.DEBIT,
        transaction_time_stamp: now,
      };
      await database.getDb().collection(collectionName.transaction).insertOne(transaction, { session });
      result = { transactionId: transaction._id, balance: newBalance };
    });
    return result;
  } catch (err) {
    throw new Error(err.message || 'Transaction failed');
  } finally {
    await session.endSession();
  }
}

module.exports = {
  getTransactions,
  getTransactionCount,
  transact,
};
