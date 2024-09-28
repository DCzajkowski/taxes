import { Page1 } from '@/pages/Page1'
import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return <Page1 />
}
