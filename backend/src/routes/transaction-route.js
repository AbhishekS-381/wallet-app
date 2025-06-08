'use strict';

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction-controller');

router.get('/transactions', transactionController.getTransactions);
router.post('/transact/:walletId', transactionController.transact);
router.get('/transactions/count', transactionController.getTransactionCount);

module.exports = router;
