import { useState } from 'react'

export default () => {
  const [token, setToken] = useState<string | null>(null)

  return { token, setToken }
}
