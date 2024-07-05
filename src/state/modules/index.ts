// 这里写上业务用的状态管理
import example from './example'
import userInfo from './userInfo'

export default () => {
  return {
    // 利用这种方式做命名空间
    example: example(),
    userInfo: userInfo(),
  }
}
