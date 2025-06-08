'use strict';

const express = require('express');
const transactionRoute = require('../../src/routes/transaction-route');
const transactionController = require('../../src/controllers/transaction-controller');

jest.mock('../../src/controllers/transaction-controller');

describe('routes/transaction-route', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(transactionRoute);
    jest.clearAllMocks();
  });

  it('should export a router', () => {
    expect(transactionRoute).toBeDefined();
    expect(typeof transactionRoute).toBe('function');
  });

  it('should handle GET /transactions', async () => {
    const mockReq = { method: 'GET', url: '/transactions', query: { walletId: '123' } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    transactionController.getTransactions.mockImplementation((req, res) => res.json([]));
    
    const route = transactionRoute.stack.find(layer => layer.route?.path === '/transactions');
    await route.route.stack[0].handle(mockReq, mockRes);

    expect(transactionController.getTransactions).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });

  it('should handle GET /transactions/count', async () => {
    const mockReq = { method: 'GET', url: '/transactions/count', query: { walletId: '123' } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    transactionController.getTransactionCount.mockImplementation((req, res) => res.json({ count: 0 }));
    
    const route = transactionRoute.stack.find(layer => layer.route?.path === '/transactions/count');
    await route.route.stack[0].handle(mockReq, mockRes);

    expect(transactionController.getTransactionCount).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ count: 0 });
  });

  it('should handle POST /transact/:walletId', async () => {
    const mockReq = { 
      method: 'POST', 
      url: '/transact/123',
      params: { walletId: '123' },
      body: { amount: 100, description: 'Test' },
    };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    transactionController.transact.mockImplementation((req, res) => res.json({ success: true }));
    
    const route = transactionRoute.stack.find(layer => layer.route?.path === '/transact/:walletId');
    await route.route.stack[0].handle(mockReq, mockRes);

    expect(transactionController.transact).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });
});
