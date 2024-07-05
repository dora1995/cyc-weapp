import { useQuery } from 'remax'
import useScene from './useScene'

function decodeURIComponentWithObject<T>(obj: T): T {
  const keys = Object.keys(obj)

  const values = keys.map((k) => ({ [k]: decodeURIComponent(obj[k]) }))

  return {
    ...obj,
    ...Object.assign({}, ...values),
  }
}

export default useQueryWithScene
function useQueryWithScene() {
  const query = decodeURIComponentWithObject(useQuery())
  const scene = useScene()

  return scene || query
}
