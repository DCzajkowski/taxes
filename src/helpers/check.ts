export function assertUnreachable(value: never): never {
  throw new Error(`Reached a code that should be unreachable. Value passed was: ${JSON.stringify(value as unknown)}`)
}

export function assertSafeKey(key: string): void {
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
    throw new Error(
      "Could not assign '__proto__' or 'constructor' or 'prototype' property. Possible prototype pollution.",
    )
  }
}

export function notNull<T>(x: T): x is Exclude<T, null> {
  return x !== null
}

export function notUndefined<T>(x: T): x is Exclude<T, undefined> {
  return x !== undefined
}

export function withFallback<T>(x: T): (y: T | undefined) => T {
  return (y) => y ?? x
}

export function match<TValue extends string | number | symbol, const TResult>(
  x: TValue,
  matcher: Record<TValue, TResult> | { default: TResult },
): TResult {
  if (x !== undefined && x in matcher) {
    return matcher[x as keyof typeof matcher]
  }

  if ('default' in matcher) {
    return (matcher as { default: TResult }).default
  }

  throw new Error(`Value passed to a match statement (${String(x)}) did not match any case.`)
}
