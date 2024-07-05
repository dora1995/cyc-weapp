import vait from 'vait'

const a = vait<string, Error>()
type cacheVType = typeof a

let cacheV: cacheVType | null = null

export default () => {
  if (cacheV) {
    return cacheV
  }

  cacheV = vait<string, Error>()

  wx.login({
    success(res) {
      if (cacheV) {
        cacheV.pass(res.code) // 根本就不需要释放 cacheV，只要小程序还在运行的时候，code 就是有效的
        cacheV = null
      }
    },
    fail(err) {
      if (cacheV) {
        cacheV.fail(new Error(err.errMsg))
        cacheV = null
      }
    },
  })

  return cacheV
}
