/* eslint-disable @typescript-eslint/no-explicit-any */

import { castArray, uniq } from '@/helpers/array'
import { assertSafeKey } from '@/helpers/check'

export function cloneDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export function filterValues<TObject extends Record<string, any>, TReturn>(
  object: TObject,
  predicate: <TKey extends keyof TObject>(value: TObject[TKey], key: TKey) => boolean,
): Record<keyof TObject, TReturn> {
  const result = {} as TObject

  for (const [key, value] of Object.entries(object)) {
    if (predicate(value, key)) {
      assertSafeKey(key)

      result[key as keyof TObject] = value
    }
  }

  return result
}

export function hasKey<TRecord, TKey extends PropertyKey>(
  key: TKey,
  record: TRecord,
): record is TRecord & Record<TKey, unknown> {
  return typeof record === 'object' && record !== null && key in record
}

export function isEqual(
  a: undefined | Record<string, any> | any[] | string | null,
  b: undefined | Record<string, any> | any[] | string | null,
): boolean {
  if (a === b) {
    return true
  }

  if (typeof a !== typeof b) {
    return false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value, i) => isEqual(value, b[i]))
  }

  if (isRecord(a) && isRecord(b)) {
    const keysA = Object.keys(a).sort()
    const keysB = Object.keys(b).sort()

    return keysA.length === keysB.length && isEqual(keysA, keysB) && keysA.every((keyA) => isEqual(a[keyA], b[keyA]))
  }

  return false
}

export function isRecord<T>(value: T): value is T & Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const proto = Object.getPrototypeOf(value)
  if (proto === null) {
    return true
  }

  const prototypeConstructor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor

  return (
    typeof prototypeConstructor === 'function' &&
    prototypeConstructor instanceof prototypeConstructor &&
    Function.prototype.toString.call(prototypeConstructor) === Function.prototype.toString.call(Object)
  )
}

export function invert<TKeys extends string, TValues extends string | number>(
  object: Record<TKeys, TValues>,
): Record<string, string> {
  const result = {} as Record<string, string>

  for (const [key, value] of Object.entries(object)) {
    const newKey = String(value)

    assertSafeKey(newKey)

    result[newKey] = key
  }

  return result
}

export function mapKeys<TObject extends Record<string, any>>(
  object: TObject,
  mapper: <TKey extends keyof TObject>(key: TKey, value: TObject[TKey]) => string,
): Record<string, TObject[keyof TObject]> {
  const result = {} as Record<string, TObject[keyof TObject]>

  for (const [key, value] of Object.entries(object)) {
    const newKey = mapper(key, value)

    assertSafeKey(newKey)

    result[newKey] = value
  }

  return result
}

export function mapValues<TObject extends Record<string, any>, TReturn>(
  object: TObject,
  mapper: <TKey extends keyof TObject>(value: TObject[TKey], key: TKey) => TReturn,
): Record<keyof TObject, TReturn> {
  const result = {} as Record<keyof TObject, TReturn>

  for (const [key, value] of Object.entries(object)) {
    assertSafeKey(key)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[key] = mapper(value, key)
  }

  return result
}

export function mergeWith<TObjectA extends Record<any, any>, TObjectB extends Record<any, any>, TResult>(
  objectA: TObjectA,
  objectB: TObjectB,
  mapper: (valueA: TObjectA[keyof TObjectA] | undefined, valueB: TObjectB[keyof TObjectB] | undefined) => TResult,
): Record<keyof TObjectA & keyof TObjectB, TResult> {
  const keys = uniq(Object.keys(objectA).concat(Object.keys(objectB)))
  const result = {} as Record<keyof TObjectA & keyof TObjectB, TResult>

  for (const key of keys) {
    assertSafeKey(key)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[key] = mapper(objectA[key], objectB[key])
  }

  return result
}

export function omit<T extends Record<string, any>, K extends keyof T>(value: T, keys: K | readonly K[]): Omit<T, K> {
  const result = { ...value }

  for (const key of castArray(keys)) {
    assertSafeKey(key as string)

    delete (result as any)[key as string]
  }

  return result as any
}

export function omitBy<T extends Record<string, any>>(
  object: T,
  predicate: <TKey extends keyof T>(key: TKey, value: T[TKey]) => boolean,
): Record<string, T[keyof T]> {
  const result = {} as Record<string, T[keyof T]>

  for (const [key, value] of Object.entries(object)) {
    if (!predicate(key, value)) {
      assertSafeKey(key)

      result[key] = value
    }
  }

  return result
}

export function pick<T extends Record<string, any>, TKey extends keyof T>(
  object: T,
  keys: TKey | TKey[] | readonly TKey[],
): Pick<T, TKey> {
  const keysToInclude = castArray(keys)
  const result = {} as Pick<T, TKey>

  for (const key of keysToInclude) {
    assertSafeKey(key as string)

    result[key as TKey] = object[key as TKey]
  }

  return result
}

export function pickBy<T extends Record<string, any>>(
  object: T,
  picker: <TKey extends keyof T>(key: TKey, value: T[TKey]) => boolean,
): T {
  const result = {} as T

  for (const [key, value] of Object.entries(object)) {
    if (picker(key, value)) {
      assertSafeKey(key)

      result[key as keyof T] = value
    }
  }

  return result
}

export function safeJsonParse(value: string): unknown | undefined {
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}

export function safeJsonStringify(value: unknown): string | undefined {
  try {
    return JSON.stringify(value)
  } catch {
    return undefined
  }
}
