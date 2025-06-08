'use strict';

const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet-controller');

router.post('/setup', walletController.setup);
router.get('/wallet/:id', walletController.getWallet);

module.exports = router;
