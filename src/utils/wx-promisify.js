// wx API Promisify

import vait from 'vait'

// 在这个列表里的 api 将不会 Promise 化
// 可自定义
export const doNotPromisify = []

const noExistAssign = (target, ...objs) => {
  objs.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      const exist = key in target
      if (!exist) {
        target = obj[key]
      }
    })
  })

  return target
}

export const GenerateRevoker = (wx) => (featureName, opt) => {
  const v = vait()
  const task = wx[featureName](
    Object.assign({}, opt, {
      success(res) {
        v.pass(res)
      },

      fail(err) {
        const bultiInError = Error(err.errMsg)
        Object.assign(bultiInError, err, {
          wxError: err,
        })
        v.fail(bultiInError)
      },
    })
  )

  if (task && typeof task === 'object') {
    v.task = task
    noExistAssign(v, task)
  }

  return v
}

export const GenerateProxifier = (nativeWX) => {
  const proxifier = {}

  const revoker = GenerateRevoker(nativeWX)

  nativeWX._promisifyRevoker = revoker

  for (let featureName in nativeWX) {
    const isFunction = typeof nativeWX[featureName] === 'function'
    const inPromisifyBlackList = doNotPromisify.indexOf(featureName) !== -1
    const isSyncFeatureName = /Sync$/.test(featureName)
    const canBePromisify = !inPromisifyBlackList && !isSyncFeatureName

    if (!isFunction) {
      Object.defineProperty(proxifier, featureName, {
        get: () => nativeWX[featureName],
      })

      continue
    }

    if (canBePromisify) {
      proxifier[featureName] = function () {
        return revoker(featureName, ...arguments)
      }
    } else {
      proxifier[featureName] = function () {
        return nativeWX[featureName](...arguments)
      }
    }
  }

  return proxifier
}

export default GenerateProxifier(wx)
