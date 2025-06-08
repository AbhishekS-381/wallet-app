'use strict';

const config = require('../../src/config/database');

describe('config/database', () => {
  it('should have mongodb config', () => {
    expect(config).toHaveProperty('mongodb');
    expect(config.mongodb).toHaveProperty('url');
    expect(typeof config.mongodb.url).toBe('string');
    expect(config.mongodb.url).toMatch(/^mongodb/);
  });

  it('should not have extra properties', () => {
    expect(Object.keys(config)).toEqual(['mongodb']);
  });
});
