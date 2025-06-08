module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/spec'],
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/*.spec.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageDirectory: 'coverage',
  verbose: true,
};
