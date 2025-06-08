'use strict';

const walletService = require('../services/wallet-service');

async function setup(req, res) {
  const { balance = 0, name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  try {
    const result = await walletService.createWallet({ name, balance });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getWallet(req, res) {
  const { id } = req.params;
  try {
    const wallet = await walletService.getWallet(id);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    // Format response as required
    res.json({
      id: wallet._id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.created_at instanceof Date ? wallet.created_at : new Date(wallet.created_at),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  setup,
  getWallet,
};
