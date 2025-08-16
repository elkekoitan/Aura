import '@testing-library/jest-native';

// Global test setup
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.useRealTimers();
});

// Mock global functions
global.fetch = jest.fn();

// Mock timers
jest.useFakeTimers();