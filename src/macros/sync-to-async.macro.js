const { createMacro } = require('babel-plugin-macros')
const matches = require('./matches')

const { ASYNC } = process.env

/**
 * This is a babel macro which exports the `a` (short for async) and `isAsync` symbols.
 * Babel uses these symbols to know where to apply certain transformations described in this
 * file, so the `a` symbol should never appear in fully transpiled output.
 *
 * The `a` macro is indeded to be used on synchronous code, and should be added anywhere that
 * an asyncronous implementation would need to differ from the sync implementation.
 *
 * Below are the patterns which `a` transforms into either sync or async variants. In sync
 * files `a` always behaves like `_ => _`. In async files, it adds either `async` or `await`
 * (as appopriate).
 *
 *           SYNC                    TEMPLATE                    ASYNC
 *                               a(function() {})
 *       function() {}                 <--->               async function() {}
 *
 *                              a(Symbol.iterator)
 *      Symbol.iterator                <--->              Symbol.asyncIterator
 *
 *                               a("methodName")
 *        "methodName"                 <--->                "asyncMethodName"
 *
 *                               a(anyExpression)
 *       anyExpression                 <--->               await anyExpression
 *
 *                             a; function fn() {}
 *     function fn() {}                <--->              async function fn() {}
 *
 *                        a; for(const foo of iterable) {}
 * for(const foo of iterable) {}       <--->       for await(const foo of iterable) {}
 *
 *                                if (isAsync) {}
 *       if (false) {}                 <--->                  if (false) {}
 *
 *                                isAsync ? x : y
 *       false ? x : y                 <--->                  true ? x : y
 *
 * Note that conditional expressions with fixed conditions (such as the last two examples)
 * will be further simplified by the dead code elimination babel plugin
 *
 * To read more about babel macros, take a look at their docs:
 * https://github.com/kentcdodds/babel-plugin-macros
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

const stringLiteralAst = {
  type: 'StringLiteral'
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

  for (const reference of references.isAsync || []) {
    // import { isAsync } from "path/to/sync-to-async.macro"

    reference.replaceWith(t.booleanLiteral(!!ASYNC))
  }

  for (const reference of references.default || []) {
    // import a from "path/to/sync-to-async.macro"

    const parentNode = reference.parent
    const { type: parentType } = parentNode

    switch (parentType) {
      case 'ExpressionStatement': {
        // a; ...

        const { container } = reference.parentPath
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
        break
      }
      case 'CallExpression': {
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

          reference.parentPath.replaceWith(target)

          break
        } else if (matches(stringLiteralAst, target)) {
          // a("methodName")

          if (ASYNC) {
            const { value } = target
            target.value = `async${value.slice(0, 1).toUpperCase()}${value.slice(1)}`
          }
        } else {
          // a(someExpression)

          if (ASYNC) {
            target = t.awaitExpression(target)
          }
        }

        reference.parentPath.replaceWith(target)
        break
      }
    }
  }
}

module.exports = createMacro(asyncMacro)
