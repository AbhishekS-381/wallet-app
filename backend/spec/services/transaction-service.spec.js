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
    const mockTx = {
      _id: 'tx1',
      walletId: 'wallet1',
      amount: 100,
      balance: 100,
      description: 'desc',
      transaction_time_stamp: new Date().toISOString(),
      type: 'Credit',
    };
    mockCollection.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue([mockTx])
    });
    const result = await transactionService.getTransactions('wallet1', 0, 10);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe('tx1');
    expect(result[0].date instanceof Date).toBe(true);
    expect(result[0].walletId).toBe('wallet1');
    expect(result[0].type).toBe('Credit');
  });

  it('getTransactionCount returns count', async () => {
    const result = await transactionService.getTransactionCount('wallet1');
    expect(result).toBe(5);
    expect(mockCollection.countDocuments).toHaveBeenCalled();
  });
});
