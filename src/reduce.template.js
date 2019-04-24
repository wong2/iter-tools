import a from './macros/a.macro'

import { curry } from './internal/a-iterable'

a; function reduce (initial, func, iterable) {
  let c = 0
  let acc = initial
  const iterator = iterable[a(Symbol.iterator)]()
  try {
    if (initial === undefined) {
      const firstResult = a(iterator.next())
      if (firstResult.done) {
        throw new Error('Cannot reduce: no initial value specified and iterable was empty')
      }
      acc = firstResult.value
      c = 1
    }
    let result
    while (!(result = a(iterator.next())).done) {
      acc = a(func(acc, result.value, c++))
    }
    return acc
  } finally { // close the iterable in case of exceptions
    if (typeof iterable.return === 'function') a(iterable.return())
  }
}

export default curry(reduce, { variadic: false, reduces: true, minArgs: 1, maxArgs: 2 })
