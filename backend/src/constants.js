'use strict';

exports.PORT = process.env.PORT || 3001;

exports.collectionName = {
  transaction: 'transactions',
  wallet: 'wallets',
};

exports.transactionTypes = {
  CREDIT: 'Credit',
  DEBIT: 'Debit',
};
