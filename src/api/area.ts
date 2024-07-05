import request from './'

type Children = {
  id: number
  pid: number
  name: string
  children: null | Children[]
}
/**
 * 获取地区列表
 */
export function getAreaList() {
  return request<Children[]>(
    {
      method: 'GET',
      url: '/user/area',
    },
    '获取地区列表'
  )
}
