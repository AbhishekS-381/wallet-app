'use strict';

const transactionController = require('../../src/controllers/transaction-controller');

jest.mock('../../src/services/transaction-service', () => ({
  getTransactions: jest.fn(),
  getTransactionCount: jest.fn(),
  transact: jest.fn(),
}));
const transactionService = require('../../src/services/transaction-service');

describe('controllers/transaction-controller', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn(() => res), json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should export expected methods', () => {
    expect(transactionController).toHaveProperty('getTransactions');
    expect(transactionController).toHaveProperty('getTransactionCount');
    expect(transactionController).toHaveProperty('transact');
  });

  it('getTransactions: should return 400 if walletId missing', async () => {
    await transactionController.getTransactions(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'walletId required' });
  });

  it('getTransactions: should return transactions', async () => {
    req.query = { walletId: '1' };
    transactionService.getTransactions.mockResolvedValue([{ _id: 'tx1' }]);
    await transactionController.getTransactions(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 'tx1' }]);
  });

  it('getTransactions: should handle service error', async () => {
    req.query = { walletId: '1' };
    transactionService.getTransactions.mockRejectedValue(new Error('fail'));
    await transactionController.getTransactions(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });

  it('getTransactionCount: should return 400 if walletId missing', async () => {
    await transactionController.getTransactionCount(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'walletId required' });
  });

  it('getTransactionCount: should return count', async () => {
    req.query = { walletId: '1' };
    transactionService.getTransactionCount.mockResolvedValue(5);
    await transactionController.getTransactionCount(req, res);
    expect(res.json).toHaveBeenCalledWith({ total: 5 });
  });

  it('getTransactionCount: should handle service error', async () => {
    req.query = { walletId: '1' };
    transactionService.getTransactionCount.mockRejectedValue(new Error('fail'));
    await transactionController.getTransactionCount(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });

  it('transact: should return transaction result', async () => {
    req.params = { walletId: '1' };
    req.body = { amount: 10, description: 'desc' };
    transactionService.transact.mockResolvedValue({ transactionId: 'tx1', balance: 100 });
    await transactionController.transact(req, res);
    expect(res.json).toHaveBeenCalledWith({
      transactionId: 'tx1',
      balance: 100,
    });
  });

  it('transact: should handle service error', async () => {
    req.params = { walletId: '1' };
    req.body = { amount: 10, description: 'desc' };
    transactionService.transact.mockRejectedValue(new Error('fail'));
    await transactionController.transact(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });
});
