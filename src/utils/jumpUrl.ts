import { webviewPath } from '@/app.config'

export function isTabPage(url: string) {
  return false // 暂时这么返回，因为这个小程序没有 tab 页
  // return Boolean(/^\/pages\/tab-/.test(url))
}

export function jumpReceivePointDescription() {
  wx.navigateTo({ url: '/packageA/receive-point-description/index' })
}
export default (url: string, isDirect: boolean = false) => {
  console.log('jumpUrl', isTabPage(url), url)

  const jumpTo = (url: string) => {
    if (isDirect) {
      wx.redirectTo({ url })
    } else {
      wx.navigateTo({ url })
    }
  }

  if (!url) {
    return 0
  } else if (/^\//.test(url)) {
    if (isTabPage(url)) {
      wx.switchTab({
        // 忽略掉 tabbar 页面的参数
        url: url.split('?')[0],
      })
      return 1001
    } else {
      jumpTo(url)
      return 1000
    }
  } else {
    if (
      url.substr(0, 7).toLowerCase() == 'http://' ||
      url.substr(0, 8).toLowerCase() == 'https://'
    ) {
      jumpTo(`/${webviewPath}?url=${encodeURIComponent(url)}`)
    }
    return 9000
  }
}
