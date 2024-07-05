const APP_TITLE = 'APP_TITLE'

export const bindUserInfomationPath = 'pages/bind-userinfomation/index'
export const intentProfile = 'pages/intentProfile/index'
export const webviewPath = 'packageA/web/index'

export const packageAPages = [webviewPath, 'packageA/tab-share/index']

export const pages = [
  'pages/tab-home/index',
  'pages/school-detail/index',
  'pages/look-examples/index',
  'pages/mp/index',
  intentProfile,
  bindUserInfomationPath,
]

export const wechat = {
  pages,
  window: {
    navigationBarTitleText: APP_TITLE,
    navigationBarBackgroundColor: '#1567E2',
    navigationStyle: 'custom',
    backgroundColor: '#FFFFFF',
  },

  subpackages: [
    {
      root: 'packageA',
      pages: packageAPages.map((packagePath) => {
        return packagePath.split('/').slice(1).join('/')
      }),
    },
  ],
  permission: {
    'scope.userFuzzyLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示',
    },
  },
  requiredPrivateInfos: ['getLocation', 'chooseLocation'],
}

export const web = {
  pages,
  title: APP_TITLE,
}

export default {
  wechat,
  web,
}
