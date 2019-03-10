import assert from 'static-type-assert'
import * as iter from '../index'

assert<
  IterableIterator<string>
>(
  iter.interleaveGenerator(
    function * (
      canTakeAny: Function,
      buffer: iter.InterleaveBuffer<string>
    ) {
      assert<boolean>(buffer.canTake())
      assert<string | undefined>(buffer.take())
      if (buffer.canTake()) {
        assert<string>(buffer.take())
        yield buffer.take()
      }
    }
  )(['foo'])
)

assert<
  IterableIterator<string | number>
>(
  iter.interleaveGenerator(
    function * (
      canTakeAny: Function,
      b1: iter.InterleaveBuffer<string>,
      b2: iter.InterleaveBuffer<number>
    ) {
      assert<boolean>(b1.canTake())
      assert<string | undefined>(b1.take())
      if (b1.canTake()) {
        assert<string>(b1.take())
        yield b1.take()
      }
      assert<boolean>(b2.canTake())
      assert<number | undefined>(b2.take())
      if (b2.canTake()) {
        assert<number>(b2.take())
        yield b2.take()
      }
    }
  )(['foo'], [2])
)

assert<
  IterableIterator<string | number | Function>
>(
  iter.interleaveGenerator(
    function * (
      canTakeAny: Function,
      b1: iter.InterleaveBuffer<string>,
      b2: iter.InterleaveBuffer<number>,
      b3: iter.InterleaveBuffer<Function>
    ) {
      assert<boolean>(b1.canTake())
      assert<string | undefined>(b1.take())
      if (b1.canTake()) {
        assert<string>(b1.take())
        yield b1.take()
      }
      assert<boolean>(b2.canTake())
      assert<number | undefined>(b2.take())
      if (b2.canTake()) {
        assert<number>(b2.take())
        yield b2.take()
      }
      assert<boolean>(b3.canTake())
      assert<Function | undefined>(b3.take())
      if (b3.canTake()) {
        assert<Function>(b3.take())
        yield b3.take()
      }
    }
  )(['foo'], [2], [(_: any) => _])
)

assert<
  IterableIterator<string | number | Function | {}>
>(
  iter.interleaveGenerator(
    function * (
      canTakeAny: Function,
      b1: iter.InterleaveBuffer<string>,
      b2: iter.InterleaveBuffer<number>,
      b3: iter.InterleaveBuffer<Function>,
      b4: iter.InterleaveBuffer<{}>
    ) {
      assert<boolean>(b1.canTake())
      assert<string | undefined>(b1.take())
      if (b1.canTake()) {
        assert<string>(b1.take())
        yield b1.take()
      }
      assert<boolean>(b2.canTake())
      assert<number | undefined>(b2.take())
      if (b2.canTake()) {
        assert<number>(b2.take())
        yield b2.take()
      }
      assert<boolean>(b3.canTake())
      assert<Function | undefined>(b3.take())
      if (b3.canTake()) {
        assert<Function>(b3.take())
        yield b3.take()
      }
      assert<boolean>(b4.canTake())
      assert<{} | undefined>(b4.take())
      if (b4.canTake()) {
        assert<{}>(b4.take())
        yield b4.take()
      }
    }
  )(['foo'], [2], [(_: any) => _], [{}])
)

// Async
// ######

assert<
  AsyncIterableIterator<string>
>(
  iter.asyncInterleaveGenerator(
    async function * (
      canTakeAny: Function,
      buffer: iter.AsyncInterleaveBuffer<string>
    ) {
      assert<Promise<boolean>>(buffer.canTake())
      assert<Promise<string | undefined>>(buffer.take())
      if (await buffer.canTake()) {
        assert<Promise<string>>(buffer.take())
        yield await buffer.take()
      }
    }
  )(['foo'])
)

assert<
  AsyncIterableIterator<string | number>
>(
  iter.asyncInterleaveGenerator(
    async function * (
      canTakeAny: Function,
      b1: iter.AsyncInterleaveBuffer<string>,
      b2: iter.AsyncInterleaveBuffer<number>
    ) {
      assert<Promise<boolean>>(b1.canTake())
      assert<Promise<string | undefined>>(b1.take())
      if (b1.canTake()) {
        assert<Promise<string>>(b1.take())
        yield await b1.take()
      }
      assert<Promise<boolean>>(b2.canTake())
      assert<Promise<number | undefined>>(b2.take())
      if (b2.canTake()) {
        assert<Promise<number>>(b2.take())
        yield b2.take()
      }
    }
  )(['foo'], [2])
)

assert<
  AsyncIterableIterator<string | number | Function>
>(
  iter.asyncInterleaveGenerator(
    async function * (
      canTakeAny: Function,
      b1: iter.AsyncInterleaveBuffer<string>,
      b2: iter.AsyncInterleaveBuffer<number>,
      b3: iter.AsyncInterleaveBuffer<Function>
    ) {
      assert<Promise<boolean>>(b1.canTake())
      assert<Promise<string | undefined>>(b1.take())
      if (b1.canTake()) {
        assert<Promise<string>>(b1.take())
        yield b1.take()
      }
      assert<Promise<boolean>>(b2.canTake())
      assert<Promise<number | undefined>>(b2.take())
      if (b2.canTake()) {
        assert<Promise<number>>(b2.take())
        yield b2.take()
      }
      assert<Promise<boolean>>(b3.canTake())
      assert<Promise<Function | undefined>>(b3.take())
      if (b3.canTake()) {
        assert<Promise<Function>>(b3.take())
        yield b3.take()
      }
    }
  )(['foo'], [2], [(_: any) => _])
)

assert<
  AsyncIterableIterator<string | number | Function | {}>
>(
  iter.asyncInterleaveGenerator(
    async function * (
      canTakeAny: Function,
      b1: iter.AsyncInterleaveBuffer<string>,
      b2: iter.AsyncInterleaveBuffer<number>,
      b3: iter.AsyncInterleaveBuffer<Function>,
      b4: iter.AsyncInterleaveBuffer<{}>
    ) {
      assert<Promise<boolean>>(b1.canTake())
      assert<Promise<string | undefined>>(b1.take())
      if (b1.canTake()) {
        assert<Promise<string>>(b1.take())
        yield b1.take()
      }
      assert<Promise<boolean>>(b2.canTake())
      assert<Promise<number | undefined>>(b2.take())
      if (b2.canTake()) {
        assert<Promise<number>>(b2.take())
        yield b2.take()
      }
      assert<Promise<boolean>>(b3.canTake())
      assert<Promise<Function | undefined>>(b3.take())
      if (b3.canTake()) {
        assert<Promise<Function>>(b3.take())
        yield b3.take()
      }
      assert<Promise<boolean>>(b4.canTake())
      assert<Promise<{} | undefined>>(b4.take())
      if (b4.canTake()) {
        assert<Promise<{}>>(b4.take())
        yield b4.take()
      }
    }
  )(['foo'], [2], [(_: any) => _], [{}])
)
