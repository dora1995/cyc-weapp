import React, { useCallback, useMemo } from 'react'
import { View } from 'remax/one'

export { ANIMATION_TIMING } from '../WindowLayout'
import WindowLayout, { Props as WindowLayoutProps } from '../WindowLayout'

import s from './index.scss'

export * from './hooks'

export type NormalProps = WindowLayoutProps & {
  title?: React.ReactNode
  body?: React.ReactNode
  type: 'alert' | 'confirm'
  cancelText?: string
  confirmText?: string
}
export type Props = NormalProps & {
  onCancel?: () => void
  onConfirm?: () => void
}

export default Modal
function Modal({
  zIndex = 10000,
  show,
  title,
  body,
  type,
  cancelText = '取消',
  confirmText = '确认',
  onCancel = () => undefined,
  onConfirm = () => undefined,
  onClosed = () => undefined,
}: Props) {
  const execConfirm = useCallback(() => {
    onConfirm()
  }, [onConfirm])
  const execCancel = useCallback(() => {
    onCancel()
  }, [onCancel])

  const btns = useMemo(() => {
    if (type === 'alert') {
      return (
        <View className={s.ButtonGroup}>
          <View className={`${s.Button} ${s.Confirm}`} onTap={execConfirm}>
            {confirmText}
          </View>
        </View>
      )
    }

    if (type === 'confirm') {
      return (
        <View className={s.ButtonGroup}>
          <View className={`${s.Button} ${s.Cancel}`} onTap={execCancel}>
            {cancelText}
          </View>
          <View className={`${s.Button} ${s.Confirm}`} onTap={execConfirm}>
            {confirmText}
          </View>
        </View>
      )
    }

    return null
  }, [cancelText, confirmText, execCancel, execConfirm, type])

  return (
    <WindowLayout show={show} onClosed={onClosed} zIndex={zIndex}>
      <View className={s.WindowInner}>
        {title ? <View className={s.TitleWrapper}>{title}</View> : null}
        {body ? <View className={s.BodyWrapper}>{body}</View> : null}
        {btns}
      </View>
    </WindowLayout>
  )
}
