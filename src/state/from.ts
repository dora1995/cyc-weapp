import { useState } from 'react'
import { useAppState } from '.'
import useQueryWithScene from '@/hooks/useQueryWithScene'

export default useFrom
function useFrom() {
  const [from, setFrom] = useState<string | null>(null)

  return { from, setFrom }
}

export const useFromDetecting = () => {
  const { setFrom } = useAppState()
  const scene = useQueryWithScene()

  if (scene?.from) {
    if (typeof scene.from === 'string') {
      setFrom(scene.from)
    } else {
      throw new Error('scene.from is not string')
    }
  }
}
