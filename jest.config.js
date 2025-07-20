module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/app/javascript/$1',
  },
  testMatch: [
    '<rootDir>/app/javascript/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/app/javascript/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'app/javascript/**/*.{js,jsx}',
    '!app/javascript/**/*.d.ts',
    '!app/javascript/**/index.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};