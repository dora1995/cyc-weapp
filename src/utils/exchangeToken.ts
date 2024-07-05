import vait from 'vait'
import weappLogin from './weappLogin'
import { submitWeappLoginCode } from '@/api/auth'
// import { getState } from '@/state'

const a = vait<string, any>()
type cacheVType = typeof a
let exchangeTokenV: cacheVType | null = null

const submitWeappLoginCodeWrapper = (code: string) => {
  // const { from } = getState()
  // if (from) {
  //   return submitWeappLoginCode({ code, source_id: from })
  // } else {
  //   return submitWeappLoginCode({ code })
  // }
  return submitWeappLoginCode({ code })
}

export default async (): Promise<string> => {
  if (exchangeTokenV) {
    return exchangeTokenV
  }

  exchangeTokenV = vait<string, any>()

  const code = await weappLogin()
  try {
    const { token } = await submitWeappLoginCodeWrapper(code)
    exchangeTokenV.pass(token)
  } catch (err) {
    exchangeTokenV.fail(err)
  }

  return exchangeTokenV
    .then((newToken) => {
      exchangeTokenV = null
      return newToken
    })
    .catch((err) => {
      exchangeTokenV = null
      throw err
    })
}
