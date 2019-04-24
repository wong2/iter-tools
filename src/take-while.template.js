import a from './macros/a.macro'

import { curry } from './internal/a-iterable'

a; function * takeWhile (func, i) {
  let take = true
  let c = 0

  a; for (const item of i) {
    take = a(func(item, c++))
    if (take) {
      yield item
    } else {
      break
    }
  }
}

export default curry(takeWhile)
