const { createMacro } = require('babel-plugin-macros')
const matches = require('./matches')

const { ASYNC } = process.env

/**
 * This is a babel macro. To read more about babel macros, take a look at their docs:
 * https://github.com/kentcdodds/babel-plugin-macros
 *
 * This macro transforms several common patterns into either sync or async variants.
 * Here is a what it will transform:
 *
 *           SYNC                    TEMPLATE                    ASYNC
 *                               a(function() {})
 *       function() {}                 <--->               async function() {}
 *
 *                              a(Symbol.iterator)
 *      Symbol.iterator                <--->              Symbol.asyncIterator
 *
 *                               a(anyExpression)
 *       anyExpression                 <--->               await anyExpression
 *
 *                             a; function fn() {}
 *     function fn() {}                <--->              async function fn() {}
 *
 *                        a; for(const foo of iterable) {}
 * for(const foo of iterable) {}       <--->       for await(const foo of iterable) {}
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

const functionDeclarationAst = {
  type: 'FunctionDeclaration'
}

const functionExpressionAst = {
  type: 'FunctionExpression'
}

const loopStatementAst = {
  type: 'ForOfStatement'
}

function asyncMacro ({ references, babel }) {
  const t = babel.types

  for (const reference of references.default) {

    const { arguments: args, type: parentType } = reference.parent

    if (parentType === 'ExpressionStatement') {
      // a; ...

      const { container, node: parentNode } = reference.parentPath
      const loopIdx = container.findIndex(node => node === parentNode) + 1
      const nextStatement = container[loopIdx]

      if (matches(loopStatementAst, nextStatement)) {
        // a; for .. of

        if (ASYNC) {
          nextStatement.await = true
        }
      } else if (matches(functionDeclarationAst, nextStatement)) {
        // a; function foo() {}

        if (ASYNC) {
          nextStatement.async = true
        }
      }

      reference.remove()

      continue
    } else if (parentType === 'IfStatement') {
      // if (a) { ... }

      reference.replaceWith(t.booleanLiteral(!!ASYNC))
      continue
    } else if (parentType === 'CallExpression') {
      // a(...)

      const { arguments: args } = reference.parent

      if (args.length !== 1) {
        throw new Error('The a() macro takes exactly one argument')
      }

      let target = args[0]

      if (matches(symbolIteratorAst, target)) {
        // a(Symbol.iterator)

        if (ASYNC) {
          target.property.name = 'asyncIterator'
        }
      } else if (matches(functionExpressionAst, target)) {
        // a(function() {})

        if (ASYNC) {
          target.async = true
        }

        target.type = 'FunctionDeclaration'

        reference.parentPath.parentPath.replaceWith(target)

        continue
      } else {
        // a(someExpression)

        if (ASYNC) {
          target = t.awaitExpression(target)
        }
      }

      reference.parentPath.replaceWith(target)
    }
  }
}

module.exports = createMacro(asyncMacro)
