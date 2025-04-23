module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/migrations/', '/knexfile.js'],
  testEnvironment: 'node',
};
