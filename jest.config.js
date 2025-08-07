module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/javascript/$1',
    '^flowbite-react$': '<rootDir>/app/javascript/components/qa_platform/__tests__/__mocks__/flowbite-react.js',
    '^react-icons/hi$': '<rootDir>/app/javascript/components/qa_platform/__tests__/__mocks__/react-icons.js'
  },
  testMatch: [
    '<rootDir>/app/javascript/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/app/javascript/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/app/javascript/components/tests/' // Ignore failing legacy tests
  ],
  collectCoverageFrom: [
    'app/javascript/**/*.{js,jsx,ts,tsx}',
    '!app/javascript/**/*.d.ts',
    '!app/javascript/**/index.{js,jsx,ts,tsx}',
    '!app/javascript/**/__tests__/**',
    '!app/javascript/**/__mocks__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        ['@babel/preset-typescript', { allExtensions: true, isTSX: true }]
      ]
    }]
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!(flowbite-react|react-icons)/)'
  ]
};