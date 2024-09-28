import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'

export function useStoredState<T>(initialValue: T, key: string): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState_] = useState<T>(() => {
    const storedValue = localStorage.getItem(key)

    return storedValue !== null ? JSON.parse(storedValue) : initialValue
  })

  const setState = useCallback(
    (value: SetStateAction<T>) => {
      setState_((oldValue) => {
        const newValue = value instanceof Function ? value(oldValue) : value

        localStorage.setItem(key, JSON.stringify(newValue))

        return newValue
      })
    },
    [key],
  )

  return useMemo(() => [state, setState], [state, setState])
}
