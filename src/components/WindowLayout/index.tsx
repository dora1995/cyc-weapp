import React, { CSSProperties, useEffect, useState } from 'react'
import { TapEvent, View } from 'remax/one'
import s from './index.scss'

export const ANIMATION_TIMING = Number(
  s.timing.match(/^\d{1,}/g)?.pop() as string
)

export type NormalProps = {
  backgroundColor?: CSSProperties['backgroundColor']
  zIndex?: CSSProperties['zIndex']
  show?: boolean
  children?: React.ReactNode
}
export type Events = {
  onClosed?: () => void
  onTapBackground?: (e: TapEvent) => void
}
export type Props = NormalProps & Events

export default Modal
function Modal({
  backgroundColor = '',
  zIndex = undefined,
  show = true,
  children = null,
  onClosed = () => undefined,
  onTapBackground = (e) => undefined,
}: Props) {
  const [isOpen, setOpen] = useState(false)
  const [isClosing, setClosing] = useState(false)
  const [closedHandler, setClosedHandler] = useState<number | boolean>(false)

  useEffect(() => {
    if (closedHandler) {
      setClosedHandler(false)
      onClosed()
    }
  }, [closedHandler, onClosed])

  useEffect(() => {
    if (show) {
      setOpen(true)
    } else {
      setClosing(true)
      const handler = setTimeout(() => {
        setOpen(false)
        setClosing(false)

        setClosedHandler(handler)
      }, ANIMATION_TIMING)

      return () => {
        clearTimeout(handler)
        setOpen(false)
        setClosing(false)
      }
    }
  }, [show])

  if (!isOpen) {
    return null
  }

  const zIndexStyle = zIndex ? { zIndex } : {}

  return (
    <View className={s.WindowLayoutWrapper} style={zIndexStyle}>
      <View
        className={`${s.BGMask} ${isClosing ? s.ModalFadeOut : ''}`}
        style={{ backgroundColor }}
      ></View>
      <View className={`${s.WindowLayout}`} onTap={onTapBackground}>
        <View
          className={`${s.Window} ${isClosing ? s.WindowFadeOut : ''}`}
          onTap={(e) => e.stopPropagation()}
        >
          {children}
        </View>
      </View>
    </View>
  )
}
