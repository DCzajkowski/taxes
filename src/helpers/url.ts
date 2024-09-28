export function qs(values: Record<string, string | string[] | boolean | number | null | undefined>): string {
  return Object.entries(values)
    .filter(
      (pair): pair is [(typeof pair)[0], Exclude<(typeof pair)[1], null | undefined>] =>
        pair[1] !== null && pair[1] !== undefined,
    )
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((x) => `${encodeURIComponent(key)}[]=${encodeURIComponent(x)}`)
        : [`${encodeURIComponent(key)}=${encodeURIComponent(value)}`],
    )
    .join('&')
}
