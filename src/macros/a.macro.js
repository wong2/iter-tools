const { createMacro } = require('babel-plugin-macros')
const matches = require("./matches");

const { ASYNC } = process.env

/**
 * This macro transforms several common patterns into either sync or async variants.
 * Here is a what it will transform:
 *
 * a(function() {})
 * a(Symbol.iterator)
 * a(anyExpression)
 * a; for(const foo of iterable) {}
 *
 * When generating sync sources, the above would become:
 *
 * function() {}
 * Symbol.iterator
 * anyExpression
 * for(const foo of iterable) {}
 *
 * When generating async sources, you would get:
 *
 * async function() {}
 * Symbol.asyncIterator
 * await anyExpression
 * for await(const foo of iterable) {}
 */

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

const loopStatementAst = {
  type: 'ForOfStatement',
}

function asyncMacro({ references, babel }) {
  const t = babel.types;

  for (const reference of references.default) {
    const { arguments: args, type: parentType } = reference.parent

    if (parentType === "ExpressionStatement") {
      const { container, node: parentNode } = reference.parentPath;
      const loopIdx = container.findIndex(node => node === parentNode) + 1
      const nextStatement = container[loopIdx]

      if (matches(loopStatementAst, nextStatement)) {
        if (ASYNC) {
          nextStatement.await = true;
        }
      }

      reference.remove()

      continue;
    }

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
