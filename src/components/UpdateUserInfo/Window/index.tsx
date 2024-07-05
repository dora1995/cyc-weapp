import React, { useMemo } from 'react'
import { Image, View } from 'remax/one'
import WindowLayout from '../../WindowLayout'
import s from './index.scss'

export { ANIMATION_TIMING } from '../../WindowLayout'

import UpdateUserButton from '../Button'
import CloseUpdateUserInfoWindow from './CloseUpdateUserInfoWindow.png'

export interface Props {
  show?: boolean
  icon: boolean
  onUpdated(): void
  onFailure(err: any): void
  onClickClose(): void
}
export default ({
  show,
  icon: showIcon,
  onUpdated,
  onFailure,
  onClickClose,
}: Props) => {
  const CloseIcon = useMemo(() => {
    if (!showIcon) {
      return null
    } else {
      return (
        <Image
          className={s.CloseUpdateUserInfoWindow}
          src={CloseUpdateUserInfoWindow}
          onTap={onClickClose}
        />
      )
    }
  }, [onClickClose, showIcon])

  return (
    <WindowLayout show={show}>
      <View className={s.BindUserInfo}>
        <Image className={s.Logo} src="/logo.png" />
        <View className={s.Title}>微信授权</View>
        <View className={s.Summary}>是否登录并继续使用小程序</View>

        <UpdateUserButton
          className={s.UpdateUserButton}
          onUpdated={onUpdated}
          onFailure={onFailure}
        >
          微信登录
        </UpdateUserButton>

        {CloseIcon}
      </View>
    </WindowLayout>
  )
}
