'use strict';

const walletController = require('../../src/controllers/wallet-controller');

jest.mock('../../src/services/wallet-service', () => ({
  getWallet: jest.fn(),
  createWallet: jest.fn(),
}));
const walletService = require('../../src/services/wallet-service');

describe('controllers/wallet-controller', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = { status: jest.fn(() => res), json: jest.fn() };
    jest.clearAllMocks();
  });

  it('should export expected methods', () => {
    expect(walletController).toHaveProperty('getWallet');
    expect(walletController).toHaveProperty('setup');
  });

  it('setup: should return 400 if name missing', async () => {
    req.body = { balance: 100 };
    await walletController.setup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Name required' });
  });

  it('setup: should create wallet and return result', async () => {
    req.body = { name: 'Test', balance: 100 };
    walletService.createWallet.mockResolvedValue({ id: '1', name: 'Test', balance: 100, date: new Date() });
    await walletController.setup(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'Test', balance: 100, date: expect.any(Date) });
  });

  it('setup: should handle service error', async () => {
    req.body = { name: 'Test', balance: 100 };
    walletService.createWallet.mockRejectedValue(new Error('fail'));
    await walletController.setup(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });

  it('getWallet: should return 404 if not found', async () => {
    req.params = { id: '1' };
    walletService.getWallet.mockResolvedValue(null);
    await walletController.getWallet(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Wallet not found' });
  });

  it('getWallet: should handle service error', async () => {
    req.params = { id: '1' };
    walletService.getWallet.mockRejectedValue(new Error('fail'));
    await walletController.getWallet(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
  });
});
