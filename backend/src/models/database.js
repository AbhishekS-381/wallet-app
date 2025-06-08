'use strict';

const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('../config/database');

const uri = config.mongodb.url;

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    Database.instance = this;
    this.client = null;
  }

  async connect() {
    if (this.client) {
      return this.client;
    }
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await this.client.connect();
    await this.client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
    return this.client;
  }

  getDb(dbName = 'wallet-app') {
    if (!this.client) {
      throw new Error('MongoDB client not connected!');
    }
    return this.client.db(dbName);
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }
}

module.exports = new Database();
