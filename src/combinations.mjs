import map from './map'
import range from './range'
import permutations from './permutations'
import { iterableCurry } from './internal/iterable'
import { combinationsSize } from './internal/math'

function isSorted (arr) {
  if (arr.length < 2) return true

  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) {
      return false
    }
  }
  return true
}

function combinations (r, iterable) {
  const arr = Array.from(iterable)
  const len = arr.length
  r = r === undefined ? len : r
  return {
    * [Symbol.iterator] () {
      const mapToIndex = map((i) => arr[i])

      for (let indices of permutations(r, range(len))) {
        if (isSorted(indices)) {
          yield Array.from(mapToIndex(indices))
        }
      }
    },
    getSize () {
      return combinationsSize(len, r)
    }
  }
}

export default iterableCurry(combinations, { reduces: true, variadic: false, minArgs: 0, maxArgs: 1 })
