'use strict';

const transactionService = require('../../src/services/transaction-service');
const walletService = require('../../src/services/wallet-service');

const mockCollection = {
  findOne: jest.fn(),
  find: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
  countDocuments: jest.fn(),
};

jest.mock('../../src/models/database', () => ({
  getDb: jest.fn(() => ({
    collection: jest.fn(() => mockCollection)
  }))
}));

jest.mock('../../src/services/wallet-service', () => ({
  getWallet: jest.fn(),
  updateWallet: jest.fn()
}));

describe('services/transaction-service', () => {
  const mockTransaction = {
    _id: 'tx1',
    amount: 100,
    balance: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    transaction_time_stamp: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.findOne.mockResolvedValue(mockTransaction);
    mockCollection.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([mockTransaction])
    });
    mockCollection.insertOne.mockResolvedValue({ insertedId: 'tx1' });
    mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });
    mockCollection.countDocuments.mockResolvedValue(5);
  });

  it('getTransaction returns transaction', async () => {
    const result = await transactionService.getTransaction('tx1');
    expect(result._id).toBe('tx1');
    expect(result.transaction_time_stamp instanceof Date).toBe(true);
  });

  it('getAllTransactions returns transactions', async () => {
    const result = await transactionService.getAllTransactions();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].transaction_time_stamp instanceof Date).toBe(true);
  });

  it('createTransaction inserts transaction', async () => {
    const newTx = { ...mockTransaction };
    await transactionService.createTransaction(newTx);
    expect(mockCollection.insertOne).toHaveBeenCalled();
  });

  it('createTransaction throws on validation error', async () => {
    mockCollection.insertOne.mockImplementation(() => {
      const error = new Error('Document failed validation');
      error.code = 121;
      throw error;
    });
    await expect(transactionService.createTransaction(mockTransaction))
      .rejects.toThrow('Invalid transaction data');
  });

  it('updateTransaction updates and returns transaction', async () => {
    const result = await transactionService.updateTransaction('tx1', { amount: 200 });
    expect(result._id).toBe('tx1');
    expect(mockCollection.updateOne).toHaveBeenCalled();
  });

  it('deleteTransaction deletes transaction', async () => {
    const result = await transactionService.deleteTransaction('tx1');
    expect(result).toBe(true);
    expect(mockCollection.deleteOne).toHaveBeenCalled();
  });

  it('getTransactions returns transactions with sorting and pagination', async () => {
    const result = await transactionService.getTransactions('wallet1', 0, 10);
    expect(Array.isArray(result)).toBe(true);
    // The backend returns {id, ...} not transaction_time_stamp
    expect(result[0].id).toBe('tx1');
    expect(result[0].date instanceof Date).toBe(true);
    expect(result[0].walletId).toBe('wallet1');
    expect(result[0].type).toBe('CREDIT');
  });

  it('getTransactionCount returns count', async () => {
    const result = await transactionService.getTransactionCount('wallet1');
    expect(result).toBe(5);
    expect(mockCollection.countDocuments).toHaveBeenCalled();
  });

  describe('transact', () => {
    beforeEach(() => {
      walletService.getWallet.mockResolvedValue({ _id: '1', balance: 100 });
      walletService.updateWallet.mockResolvedValue({ _id: '1', balance: 110 });
    });

    it('throws if wallet not found', async () => {
      // Mock session for transaction
      const session = { withTransaction: fn => { throw new Error('Wallet not found'); }, endSession: jest.fn() };
      const db = require('../../src/models/database');
      db.getDb().client = { startSession: () => session };
      walletService.getWallet.mockResolvedValue(null);
      await expect(transactionService.transact('bad', 10, 'test'))
        .rejects.toThrow('Wallet not found');
    });

    it('throws if insufficient balance', async () => {
      // Mock session for transaction
      const session = { withTransaction: fn => { throw new Error('Insufficient balance'); }, endSession: jest.fn() };
      const db = require('../../src/models/database');
      db.getDb().client = { startSession: () => session };
      walletService.getWallet.mockResolvedValue({ _id: '1', balance: 50 });
      await expect(transactionService.transact('1', -100, 'test'))
        .rejects.toThrow('Insufficient balance');
    });

    it('inserts transaction and updates wallet', async () => {
      // Mock session for transaction
      const session = { withTransaction: fn => fn(), endSession: jest.fn() };
      const db = require('../../src/models/database');
      db.getDb().client = { startSession: () => session };
      mockCollection.findOneAndUpdate = jest.fn().mockResolvedValue({ value: { balance: 110 } });
      mockCollection.insertOne = jest.fn().mockResolvedValue({ insertedId: 'tx1' });
      const result = await transactionService.transact('1', 10, 'test');
      expect(result.balance).toBe(110);
      expect(mockCollection.insertOne).toHaveBeenCalled();
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalled();
    });

    it('throws on validation error', async () => {
      // Mock session for transaction
      const session = { withTransaction: fn => { throw new Error('Document failed validation'); }, endSession: jest.fn() };
      const db = require('../../src/models/database');
      db.getDb().client = { startSession: () => session };
      mockCollection.findOneAndUpdate = jest.fn().mockResolvedValue({ value: { balance: 110 } });
      mockCollection.insertOne.mockImplementation(() => {
        const error = new Error('Document failed validation');
        error.code = 121;
        throw error;
      });
      await expect(transactionService.transact('1', 10, 'test'))
        .rejects.toThrow('Invalid transaction data');
    });
  });
});
