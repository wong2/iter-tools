const { createMacro } = require('babel-plugin-macros')

const { ASYNC } = process.env

function matches(fragment, ast) {
  for (const key in fragment) {
    if (fragment.hasOwnProperty(key)) {
      const value = fragment[key]
      const astValue = ast[key]
      if (value && typeof value === "object" ? !matches(value, astValue) : value !== astValue) {
        return false
      }
    }
  }
  return true;
}

const symbolIteratorAst = {
  type: 'MemberExpression',
  object: {
    name: 'Symbol'
  },
  property: {
    name: 'iterator'
  }
}

const functionExpressionAst = {
  type: 'FunctionExpression',
}

function asyncMacro({ references, babel }) {
  const t = babel.types;

  for (const reference of references.default) {
    const { arguments: args } = reference.parent

    if (args.length !== 1) {
      throw new Error('The a() macro takes exactly one argument')
    }

    let target = args[0]

    if (matches(symbolIteratorAst, target)) {
      if (ASYNC) {
        target.property.name = 'asyncIterator'
      }
    } else if (matches(functionExpressionAst, target)) {
      if (ASYNC) {
        target.async = true;
      }

      target.type = 'FunctionDeclaration'

      reference.parentPath.parentPath.replaceWith(target)

      continue;
    } else {
      if (ASYNC) {
        target = t.awaitExpression(target)
      }
    }

    reference.parentPath.replaceWith(target)
  }
}

module.exports = createMacro(asyncMacro)
