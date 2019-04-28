const { ASYNC } = process.env

function makeProject (projectConfig) {
  return Object.assign({
    moduleFileExtensions: ['js', 'mjs'],
    setupFilesAfterEnv: ['./src/__tests__/__framework__/init-framework.js'],
    transform: {
      '.*': '<rootDir>/transformers/' + projectConfig.name
    },
    displayName: projectConfig.name + (ASYNC ? '-async' : '-sync'),
    testRegex: ASYNC ? '/__tests__/a-.*\\.test\\.js$' : '/__tests__/.*\\.test\\.js$',
  }, projectConfig)
}

module.exports = {
  testEnvironment: 'node',
  testMatch: [],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  projects: [
    makeProject({
      name: 'es5'
    }),
    makeProject({
      name: 'es2015'
    }),
    ...(process.env.CI
      ? [makeProject({
        name: 'es2018'
      })]
      : [])
  ]
}
