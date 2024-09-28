// Special characters that don't have a decomposed representation in Unicode.
// Reference: https://youmightnotneed.com/lodash#deburr
// Reference: https://github.com/cedmax/youmightnotneed/pull/197
const specialCharactersMap = new Map([
  ['œ', 'oe'],
  ['æ', 'ae'],
  ['Æ', 'Ae'],
  ['Œ', 'Oe'],
  ['Ð', 'D'],
  ['D', 'D'],
  ['Đ', 'D'],
  ['ð', 'd'],
  ['d', 'd'],
  ['đ', 'd'],
  ['Ħ', 'H'],
  ['ħ', 'h'],
  ['İ', 'I'],
  ['ı', 'i'],
  ['ĸ', 'k'],
  ['Ŀ', 'L'],
  ['Ł', 'L'],
  ['ŀ', 'l'],
  ['ł', 'l'],
  ['Ŋ', 'N'],
  ['ŋ', 'n'],
  ['Ø', 'O'],
  ['ø', 'o'],
  ['ſ', 's'],
  ['Ŧ', 'T'],
  ['ŧ', 't'],
  ['Þ', 'Th'],
  ['þ', 'th'],
  ['ß', 'ss'],
  ['Ĳ', 'IJ'],
  ['ĳ', 'ij'],
])

const deburrRegex = new RegExp(Array.from(specialCharactersMap.keys()).join('|'), 'g')

export function deburr(string: string): string {
  const baseDeburred = string
    // Normalize to decomposed form (characters with diacritics are split into combining diacritic + deburred
    // character).
    .normalize('NFD')
    // Remove all combining diacritics.
    .replace(/\p{Diacritic}/gu, '')

  const matches = baseDeburred.matchAll(deburrRegex)

  let result = baseDeburred

  for (const match of matches) {
    const replacement = specialCharactersMap.get(match[0])
    const index = match.index

    if (replacement === undefined || index === undefined) {
      continue
    }

    result = replaceStringAt(result, index, replacement)
  }

  return result
}

export function lowerFirst(string: string): string {
  const firstChar = string[0]
  if (firstChar === undefined) {
    return ''
  }

  return firstChar.toLowerCase() + string.substring(1)
}

export function upperFirst(string: string): string {
  const firstChar = string[0]
  if (firstChar === undefined) {
    return ''
  }

  return firstChar.toUpperCase() + string.substring(1)
}

export function padStart(string: string | undefined = '', length: number, padValue: string): string {
  if (string.length >= length) {
    return string
  }

  return `${padValue.repeat(length - string.length)}${string}`
}

export function padEnd(string: string | undefined = '', length: number, padValue: string): string {
  if (string.length >= length) {
    return string
  }

  return `${string}${padValue.repeat(length - string.length)}`
}

export function pascalCase(string: string): string {
  const separator = string.includes(' ') ? ' ' : string.includes('_') ? '_' : string.includes('-') ? '-' : null

  if (separator === null) {
    return string
  }

  return string
    .split(separator)
    .map((part) => upperFirst(part.toLowerCase()))
    .join('')
}

export function repeat(string: string, n: number): string {
  return string.repeat(n)
}

export function replaceStringAt(string: string, index: number, replacement: string): string {
  if (index < 0 || index >= string.length) {
    return string
  }

  return string.substring(0, index) + replacement + string.substring(index + 1)
}

export function snakeCase(string: string): string {
  const separator = string.includes(' ') ? ' ' : string.includes('_') ? '_' : string.includes('-') ? '-' : null

  if (separator === null) {
    return string
      .split('')
      .map((char, i) => (i !== 0 && /^[A-Z]$/.test(char) ? `_${char}` : char))
      .join('')
      .toLowerCase()
  }

  return string
    .split(separator)
    .map((part) => part.toLowerCase())
    .filter((part) => part.length !== 0)
    .join('_')
}

export function reverse(string: string): string {
  return string.split('').reverse().join('')
}

export function commonStart(string1: string, string2: string): string {
  let i = 0

  while (i < string1.length && i < string2.length && string1[i] === string2[i]) {
    i++
  }

  return string1.slice(0, i)
}

export function commonEnd(string1: string, string2: string): string {
  let i = 0

  while (
    i < string1.length &&
    i < string2.length &&
    string1[string1.length - i - 1] === string2[string2.length - i - 1]
  ) {
    i++
  }

  return string1.slice(string1.length - i)
}

export function subtractFromEdges(string1: string, string2: string): string {
  return subtractFromEnd(subtractFromStart(string1, string2), string2)
}

export function subtractFromEnd(string1: string, string2: string): string {
  if (!string1.endsWith(string2)) {
    return string1
  }

  return string1.slice(0, string1.length - string2.length)
}

export function subtractFromStart(string1: string, string2: string): string {
  if (!string1.startsWith(string2)) {
    return string1
  }

  return string1.slice(string2.length)
}

/**
 * Compares current string to previous one, returning information about common and changed parts:
 *  - `commonStart` - Shared beginning of both compared strings.
 *  - `commonEnd` - Shared ending of both compared strings. The commonEnd does not overlap with the commonStart,
 *  - `removed` - A part of the previous string that was replaced to obtain current string.
 *  - `added` - A part of the current string that was used as a replacement to the removed part of the previous string.
 *
 * Examples:
 *
 * ```js
 * const result = compare('text with change in it', 'text without changes in it')
 * result.commonStart === 'text with' // true
 * result.commonEnd === ' in it' // true
 * result.removed === 'out changes' // true
 * result.added === ' change' // true
 * ```
 */
export function compare(
  current: string,
  previous: string,
): { commonStart: string; commonEnd: string; removed: string; added: string } {
  const start = commonStart(current, previous)

  const currentWithoutStart = subtractFromStart(current, start)
  const previousWithoutStart = subtractFromStart(previous, start)

  const end = commonEnd(currentWithoutStart, previousWithoutStart)

  const currentWithoutStartAndEnd = subtractFromEnd(currentWithoutStart, end)
  const previousWithoutStartAndEnd = subtractFromEnd(previousWithoutStart, end)

  return { commonStart: start, commonEnd: end, removed: previousWithoutStartAndEnd, added: currentWithoutStartAndEnd }
}
