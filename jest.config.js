module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json'
  ],
  // transform: {
  //   '^.+\\.vue$': 'vue-jest',
  //   '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  //   '^.+\\.jsx?$': 'babel-jest'
  // },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // snapshotSerializers: [
  //   'jest-serializer-vue'
  // ],
  testMatch: [
    '**/tests/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/tests/**/**/*.spec.(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/tests/unit/components/',
    '<rootDir>/tests/unit/views/'
  ],
  testURL: 'http://localhost/',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/dist/**',
    '!**/tests/coverage/**',
    '!**/*.config.js',
    '!**/assets/**',
    '!**/{index,router,registerServiceWorker,main,store,bus,interceptor,quotationModel}.js'
  ],
  coverageDirectory: './tests/coverage',
  coverageReporters: ['html', 'text-summary'],
  testResultsProcessor: './node_modules/jest-junit-reporter'
}
