'use strict';

const express = require('express');
const walletRoute = require('../../src/routes/wallet-route');
const walletController = require('../../src/controllers/wallet-controller');

jest.mock('../../src/controllers/wallet-controller');

describe('routes/wallet-route', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(walletRoute);
    jest.clearAllMocks();
  });

  it('should export a router', () => {
    expect(walletRoute).toBeDefined();
    expect(typeof walletRoute).toBe('function');
  });

  it('should handle POST /setup', async () => {
    const mockReq = { method: 'POST', url: '/setup', body: { name: 'Test', balance: 100 } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    walletController.setup.mockImplementation((req, res) => res.json({ success: true }));
    
    const route = walletRoute.stack.find(layer => layer.route?.path === '/setup');
    await route.route.stack[0].handle(mockReq, mockRes);

    expect(walletController.setup).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ success: true });
  });

  it('should handle GET /wallet/:id', async () => {
    const mockReq = { method: 'GET', url: '/wallet/123', params: { id: '123' } };
    const mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    walletController.getWallet.mockImplementation((req, res) => res.json({ id: '123' }));
    
    const route = walletRoute.stack.find(layer => layer.route?.path === '/wallet/:id');
    await route.route.stack[0].handle(mockReq, mockRes);

    expect(walletController.getWallet).toHaveBeenCalledWith(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ id: '123' });
  });
});
