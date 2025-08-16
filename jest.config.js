module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    './jest.setup.js',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|@reduxjs/toolkit|@tanstack/react-query))',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
    '!src/**/types.{ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 10000,
  verbose: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/coverage/',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/example/',
    '<rootDir>/android/',
    '<rootDir>/ios/',
    '<rootDir>/web/',
  ],
  globals: {
    __DEV__: true,
    __TEST__: true,
  },
  reporters: ['default'],
  cache: true,
  cacheDirectory: '<rootDir>/jest-cache/',
};