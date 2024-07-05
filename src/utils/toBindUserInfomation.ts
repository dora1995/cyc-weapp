import qs from 'qs'
import { bindUserInfomationPath } from '@/app.config'

let inBindUserInfomationPage = false

function getCurrentPage() {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

/**
 * 重定向到绑定用户信息页
 *
 * **不过需要注意的是**，tabbar 的页面是不支持带上参数跳转的
 */
export default function tobindUserInfomation() {
  console.log('tobindUserInfomation')
  const { options, route } = getCurrentPage()

  if (inBindUserInfomationPage || route === bindUserInfomationPath) {
    // 如果是在 pages/bind-userinfomation/index 调用此页面，则无法跳转
    return
  }

  const paramsStr = qs.stringify(options)
  const callbackParamsStr = qs.stringify({ callback: `/${route}?${paramsStr}` })

  inBindUserInfomationPage = true
  // wx.navigateTo({
  //   url: `/${bindUserInfomationPath}?${callbackParamsStr}`,
  // })
  wx.redirectTo({
    url: `/${bindUserInfomationPath}?${callbackParamsStr}`,
  })
}

export function clearBindUserInfomationLock() {
  inBindUserInfomationPage = false
}
