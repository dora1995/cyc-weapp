import { useCallback, useState } from 'react'
import { UserInfo, getUserInfo } from '@/api/user'

export default () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  const refreshUserInfo = useCallback(async () => {
    const info = await getUserInfo()
    setUserInfo(info)
    return info
  }, [])

  return {
    userInfo,
    setUserInfo,
    refreshUserInfo,
  }
}
