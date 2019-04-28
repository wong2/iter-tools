const babelJest = require('babel-jest')

module.exports = function (configFile) {
  return babelJest.createTransformer({
    configFile: './' + configFile,
    plugins: [
      'add-module-exports',
      '@babel/plugin-transform-modules-commonjs',
      './babel-plugin-resolve-a-import-paths',
      'macros',
    ]
    // presets: ["jest"] // something else is loading this I guess...
  })
}
