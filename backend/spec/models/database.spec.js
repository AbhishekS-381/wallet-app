'use strict';

const Database = require('../../src/models/database');

jest.mock('mongodb', () => {
  const mClient = {
    connect: jest.fn().mockResolvedValue(true),
    db: jest.fn().mockReturnValue({ command: jest.fn().mockResolvedValue(true) }),
    close: jest.fn().mockResolvedValue(true),
  };
  return {
    MongoClient: jest.fn(() => mClient),
    ServerApiVersion: { v1: '1' },
  };
});

describe('models/database', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterAll(() => {
    console.log.mockRestore();
  });
  beforeEach(() => {
    Database.client = null;
  });

  it('should connect and return a client', async () => {
    const client = await Database.connect();
    expect(client).toBeTruthy();
    expect(Database.client).toBeTruthy();
  });

  it('should not reconnect if already connected', async () => {
    const first = await Database.connect();
    const second = await Database.connect();
    expect(first).toBe(second);
  });

  it('should getDb if connected', async () => {
    await Database.connect();
    const db = Database.getDb('wallet-app');
    expect(db).toBeTruthy();
  });

  it('should throw if getDb called before connect', () => {
    Database.client = null;
    expect(() => Database.getDb()).toThrow('MongoDB client not connected!');
  });

  it('should close the client', async () => {
    await Database.connect();
    await Database.close();
    expect(Database.client).toBeNull();
  });
});
