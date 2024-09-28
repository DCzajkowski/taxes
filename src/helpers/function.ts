/* eslint-disable @typescript-eslint/no-explicit-any */

export type DebouncedFn<TFunction extends (...params: any[]) => any> = ((
  ...params: Parameters<TFunction>
) => undefined) & {
  cancel: () => void
  flush: () => void
}

export function debounce<TFunction extends (...params: any[]) => any>(
  fn: TFunction,
  delay: number,
  { edge }: { edge: 'trailing' | 'leading' } = { edge: 'trailing' },
): DebouncedFn<TFunction> {
  let timeoutCallback: (() => void) | null = null
  let timeout: ReturnType<typeof setTimeout> | null = null
  let canInvoke = true

  const cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }

    timeoutCallback = null
  }

  const flush = () => {
    timeoutCallback?.()
    cancel()
  }

  const result = (...params: Parameters<TFunction>) => {
    if (edge === 'trailing') {
      cancel()

      timeoutCallback = () => {
        fn(...params)
        cancel()
      }
      timeout = setTimeout(timeoutCallback, delay)
    } else {
      if (canInvoke) {
        fn(...params)
        canInvoke = false
      } else {
        cancel()
      }

      timeoutCallback = () => {
        canInvoke = true
        cancel()
      }
      timeout = setTimeout(timeoutCallback, delay)
    }

    return undefined
  }

  result.cancel = cancel
  result.flush = flush

  return result
}

export function identity<T>(value: T): T {
  return value
}

/**
 * Memoizes, same as lodash, based on **just** the first argument.
 */
export function memoize<TFunction extends (...params: any[]) => any>(
  fn: TFunction,
): TFunction & { cache: Map<Parameters<TFunction>[0], ReturnType<TFunction>> } {
  const cache = new Map<Parameters<TFunction>[0], ReturnType<TFunction>>()

  const memoizedFn = ((param: any, ...params: any[]) => {
    if (cache.has(param)) {
      return cache.get(param)
    }

    const result = fn(param, ...params)

    cache.set(param, result)

    return result
  }) as any

  memoizedFn.cache = cache

  return memoizedFn
}

export function noop(): void {
  //
}

export function once<TFn extends (...args: any[]) => any>(fn: TFn): TFn {
  let result: any
  let executed = false

  return ((...args: any[]) => {
    if (executed) {
      return result
    }

    result = fn(...args)
    executed = true

    return result
  }) as any
}

type Pipe<TInput> = {
  then: <TOutput>(fn: (input: TInput) => TOutput) => Pipe<TOutput>
  value: () => TInput
}

export function pipe<TInput>(input: TInput): Pipe<TInput> {
  return {
    then(fn: any) {
      return pipe(fn(input))
    },
    value() {
      return input
    },
  }
}

/**
 * Allows to write try/catch in one statement, changing:
 * ```ts
 * // Traditional try/catch
 * let url: URL | null = null
 *
 * try {
 *   url = new URL('')
 * } catch {
 *   //
 * }
 *
 * // With rescue
 * const url = rescue(
 *   () => new URL(''),
 *   () => null,
 * )
 * ```
 */
export function rescue<T>(fn: () => T, onError: (error: Error) => T): T {
  try {
    return fn()
  } catch (error) {
    return onError(error instanceof Error ? error : new Error(String(error)))
  }
}

export function tap<TValue>(value: TValue, fn: (value: TValue) => unknown): TValue {
  fn(value)
  return value
}

export function throttle<TFunction extends (...params: any[]) => any>(
  fn: TFunction,
  delay: number,
  { edge }: { edge: 'trailing' | 'leading' } = { edge: 'leading' },
): (...params: Parameters<TFunction>) => undefined {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let canInvoke = true

  return (...params: Parameters<TFunction>) => {
    if (canInvoke) {
      if (edge === 'leading') {
        canInvoke = false
        fn(...params)

        if (timeout !== null) {
          clearTimeout(timeout)
          timeout = null
        }

        timeout = setTimeout(() => (canInvoke = true), delay)
      } else {
        canInvoke = false

        if (timeout !== null) {
          clearTimeout(timeout)
          timeout = null
        }

        timeout = setTimeout(() => {
          fn(...params)
          canInvoke = true
        }, delay)
      }
    }

    return undefined
  }
}

/**
 * Returns a promise that resolves after the specified amount of time in milliseconds.
 *
 * @alias sleep
 */
export function wait(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export type AsyncQueue = {
  schedule: <T>(callback: () => Promise<T>) => Promise<T>
}

export function asyncQueue(): AsyncQueue {
  const tasks: (() => void)[] = []
  let processing = false

  function processNext(): void {
    const nextTask = tasks.shift()
    if (nextTask === undefined) {
      processing = false
      return
    }

    processing = true
    void nextTask()
  }

  return {
    schedule: async (callback) => {
      return new Promise((resolve, reject) => {
        tasks.push(() => {
          callback()
            //
            .then(resolve)
            .catch(reject)
            .finally(processNext)
        })

        if (!processing) {
          processNext()
        }
      })
    },
  }
}
