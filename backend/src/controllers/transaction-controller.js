'use strict';

const transactionService = require('../services/transaction-service');

async function getTransactions(req, res) {
  const { walletId, skip = 0, limit = 100, sortBy = 'transaction_time_stamp', sortDir = 'desc' } = req.query;
  if (!walletId) {
    return res.status(400).json({ error: 'walletId required' });
  }
  try {
    const txs = await transactionService.getTransactions(
      walletId,
      parseInt(skip),
      parseInt(limit),
      sortBy,
      sortDir,
    );

    const formatted = txs.map(tx => ({
      id: tx.id,
      walletId: tx.walletId,
      amount: tx.amount,
      balance: tx.balance,
      description: tx.description,
      date: tx.transaction_time_stamp ? new Date(tx.transaction_time_stamp) : (tx.date instanceof Date ? tx.date : new Date(tx.date)),
      type: tx.type,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTransactionCount(req, res) {
  const { walletId } = req.query;
  if (!walletId) {
    return res.status(400).json({ error: 'walletId required' });
  }
  try {
    const count = await transactionService.getTransactionCount(walletId);
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function transact(req, res) {
  const { walletId } = req.params;
  const { amount, description } = req.body;
  try {
    const result = await transactionService.transact(walletId, amount, description);
    res.json({
      balance: result.balance,
      transactionId: result.transactionId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getTransactions,
  getTransactionCount,
  transact,
};
