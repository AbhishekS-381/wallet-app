'use strict';

const express = require('express');
const cors = require('cors');
const database = require('./models/database');
const walletRoutes = require('./routes/wallet-route');
const transactionRoutes = require('./routes/transaction-route');
const { PORT } = require('./constants');

const app = express();
app.use(express.json());
app.use(cors());

app.use(walletRoutes);
app.use(transactionRoutes);

async function startServer() {
  try {
    await database.connect();
    app.listen(PORT, () => console.log(`Wallet backend running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

module.exports = { app, startServer };
