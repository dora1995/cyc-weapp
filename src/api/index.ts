import Axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'

import baseEnv from '@/baseEnv'
import { getState } from '@/state'
import exchangeToken from '@/utils/exchangeToken'
import toindUserInfomation from '@/utils/toBindUserInfomation'

// 刷新token
async function refreshToken() {
  const newToken = await exchangeToken()
  const { setToken } = getState()
  setToken(newToken)
  return newToken
}

if (baseEnv.platform === 'weapp') {
  Axios.defaults.adapter = mpAdapter
}
const axiosInstance = Axios.create({
  baseURL: baseEnv.baseURL,
  timeout: baseEnv.requestTimeout,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers['content-type'] = 'application/json'

    if (config.url === '/user/auth/weapp/login') {
      // 小程序登录接口直接跳过 token 检查
      return config
    }

    const { token } = getState()
    if (token !== null) {
      config.headers['Authorization'] = token
    } else {
      // 如果没有 token，则进行登录操作
      config.headers['Authorization'] = await refreshToken()
    }

    return config
  },
  (err) => Promise.reject(err)
)

type Response<
  D extends unknown,
  C extends number,
  M extends string = string
> = { code: C; message: M; data: D }

type ServerResponse<Data extends unknown> =
  | Response<Data, 200> // 正常
  | Response<Data, 4100, '鉴权失败'>
  | Response<Data, 4102, '未微信昵称授权'>
  | Response<Data, 4103, '未手机号授权'>
  | Response<Data, 4104, '未授权年级'>
  | Response<Data, 4105, '未授权地理位置'>
  | Response<Data, 40401, 'Not Found'>
  | Response<Data, number> // 未知错误

type Opts = Parameters<typeof axiosInstance.request>[0]
export class RequestError extends Error {
  constructor(
    public message: string,
    public code: number,
    private opts: Opts,
    public isSilent: boolean = false,
    public description: string = ''
  ) {
    super(message)
  }

  public retry() {
    return request(this.opts)
  }
}

export default request
async function request<BackData extends unknown>(
  opts: Opts,
  apiRequestDescription: string = ''
) {
  const response = await axiosInstance.request<BackData>({
    ...opts,
    async transformResponse(res: ServerResponse<BackData>): Promise<BackData> {
      if (res.code === 200) {
        return res.data
      } else {
        const userInfoRequired =
          [4102, 4103, 4104, 4105].indexOf(res.code) !== -1

        const requestError = new RequestError(
          res.message,
          res.code,
          opts,
          userInfoRequired, // 如果是需要绑定资料的情况， 就会是静默处理的错误对象（isSilent 为 true)
          apiRequestDescription
        )

        if (userInfoRequired) {
          // 需要绑定用户资料的情况
          // 这儿跳转到绑定页去了
          toindUserInfomation()
        }

        throw requestError
      }
    },
  })

  const { data } = response
  return data
}
