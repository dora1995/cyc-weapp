import { useMemo } from 'react'
import { useQuery } from 'remax'
import qs from 'qs'

export default useScene
function useScene<
  Q extends Record<string, string | undefined> = {
    [name: string]: string | undefined
  }
>(): Q | null {
  const { scene } = useQuery()

  return useMemo(() => {
    if (scene) {
      const sceneDecoded = decodeURIComponent(scene)
      return qs.parse(sceneDecoded) as Q
    } else {
      return null
    }
  }, [scene])
}
