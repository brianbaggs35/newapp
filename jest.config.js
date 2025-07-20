module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
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
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(flowbite-react|react-icons)/)'
  ]
};