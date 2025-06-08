'use strict';

const walletService = require('../../src/services/wallet-service');

const mockCollection = {
  findOne: jest.fn(),
  find: jest.fn(),
  insertOne: jest.fn(),
  updateOne: jest.fn(),
  deleteOne: jest.fn(),
};

jest.mock('../../src/models/database', () => ({
  getDb: jest.fn(() => ({
    collection: jest.fn(() => mockCollection),
  })),
}));

describe('services/wallet-service', () => {
  const mockWallet = {
    _id: '1',
    name: 'Test Wallet',
    balance: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCollection.findOne.mockResolvedValue(mockWallet);
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue([mockWallet]),
    });
    mockCollection.insertOne.mockResolvedValue({ insertedId: '1' });
    mockCollection.updateOne.mockResolvedValue({ modifiedCount: 1 });
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });
  });

  describe('createWallet', () => {
    beforeEach(() => {
      mockCollection.insertOne.mockResolvedValue({ insertedId: '1' });
    });

    it('inserts only wallet if balance = 0', async () => {
      await walletService.createWallet({ name: 'Test', balance: 0 });
      expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    });

    it('throws on validation error', async () => {
      mockCollection.insertOne.mockImplementation(() => {
        const error = new Error('Document failed validation');
        error.code = 121;
        throw error;
      });
      await expect(walletService.createWallet({ name: 'Test', balance: 100 })).rejects.toThrow(
        'Invalid wallet data',
      );
    });
  });
});
