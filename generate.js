const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');
const babel = require('@babel/core');

const { dirname, relative, join, resolve } = path;

const { ASYNC } = process.env

function resolveAImportPaths({ types: t }) {
  const visitor = {
    ImportDeclaration(path, state) {
      const { source } = path.node;
      source.value = source.value.replace(/\ba-/, ASYNC ? 'async-' : '')
    },
  };

  return {
    name: 'resolve-a-import-paths',
    visitor,
  };
}

const srcDir = './src';

function processPath(basename) {
  const filename = join(srcDir, `${basename}.template.js`);

  const impl = babel.transformFileSync(filename, {
    babelrc: false,
    configFile: false,
    plugins: [
      babel.createConfigItem(resolveAImportPaths),
      "babel-plugin-macros",
      // ['minify-dead-code-elimination', { keepFnName: true, keepFnArgs: true, keepClassName: true }],
    ],
  }).code;

  const destFilename = join(srcDir, ASYNC ? `async-${basename}.mjs` : `${basename}.mjs`);

  fs.writeFileSync(destFilename, impl, 'utf8');
}

recursive(resolve(__dirname, srcDir)).then(paths => {
  for (const path of paths) {
    const [match, basename] = /(.*)\.template\.js/.exec(path) || [];
    if (match) {
      processPath(relative(join(__dirname, srcDir), basename));
    }
  }
}).catch(console.error);
