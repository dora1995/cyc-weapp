import request from './'

export type UserInfo = {
  id: number
  nickname: string
  headimgurl: string
  update_status: 0 | 1 // 是否更新过的用户信息状态;0:未更新， 1:已更新
  point: number
}
/**
 * 返回用户资料信息
 *
 * 昵称、头像、用户信息状态(是否提交过个人资料)、积分值
 */
export function getUserInfo() {
  return request<UserInfo>({
    method: 'GET',
    url: '/user/get_user_info',
  })
}
