import map from './map'
import range from './range'
import product from './product'
import { iterableCurry } from './internal/iterable'
import { combinationsWithReplacementSize } from './internal/math'

function isSorted (arr) {
  if (arr.length < 2) return true

  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) {
      return false
    }
  }
  return true
}

function combinationsWithReplacement (r, iterable) {
  const arr = Array.from(iterable)
  const len = arr.length
  r = r === undefined ? len : r
  return {
    * [Symbol.iterator] () {
      const mapToIndex = map((i) => arr[i])
      for (let indices of product(...map(() => range(len), range(r)))) {
        if (isSorted(indices)) {
          yield Array.from(mapToIndex(indices))
        }
      }
    },
    getSize () {
      return combinationsWithReplacementSize(len, r)
    }
  }
}

export default iterableCurry(combinationsWithReplacement, { reduces: true, variadic: false, minArgs: 0, maxArgs: 1 })
