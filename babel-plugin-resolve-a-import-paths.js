const { ASYNC } = process.env

module.exports = function resolveAImportPaths({ types: t }) {
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
