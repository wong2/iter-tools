/* eslint-env jest */
import a, { isAsync } from '../macros/sync-to-async.macro'
import { reduce as syncReduce, asyncReduce, range } from '..'
import { OneTwoThreeIterable, AsyncOneTwoThreeIterable } from '../internal/test-fixtures'

describe(a('reduce'), function () {
  const reduce = isAsync ? asyncReduce : syncReduce

  it('sums an array', a(function () {
    const sum = a(reduce((acc = 0, x) => acc + x, [0, 1, 2, 3]))
    expect(sum).toBe(6)
  }))

  it('sums a range', a(function () {
    const sum = a(reduce((acc = 0, x) => acc + x, range(4)))
    expect(sum).toBe(6)
  }))

  it('sums using a specified initial value', a(function () {
    const sum = a(reduce(1, (acc, x) => acc + x, range(4)))
    expect(sum).toBe(7)
  }))

  it('sums using the initial value as the initial value', a(function () {
    const sum = a(reduce((acc, x) => acc + x, range({ start: 2, end: 4 })))
    expect(sum).toBe(5)
  }))

  it('returns specified initial value when iterable is empty', a(function () {
    const sum = a(reduce(0, (acc, x) => acc + x, []))
    expect(sum).toBe(0)
  }))

  it('throws when no initial value specified and iterable is empty', a(function () {
    if (isAsync) {
      expect(asyncReduce((acc, x) => acc + x, [])).rejects.toThrow()
    } else {
      expect(() => {
        syncReduce((acc, x) => acc + x, [])
      }).toThrow()
    }
  }))

  it('sums a range (using curry)', a(function () {
    const sum = reduce((acc = 0, x) => acc + x)
    expect(a(sum(range(4)))).toBe(6)
  }))

  it('cleans up iterable', a(function () {
    const oneTwoThree = isAsync ? new AsyncOneTwoThreeIterable() : new OneTwoThreeIterable()
    try {
      a(reduce((acc = 0, x) => {
        throw new Error('ops')
      }, oneTwoThree))
    } catch (e) {
      expect(oneTwoThree).toHaveProperty('isCleanedUp', true)
    }
  }))
})
