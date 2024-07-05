import vait from 'vait'
import React, { ReactNode, PropsWithChildren, useState, useEffect } from 'react'
import { View } from 'remax/one'
import s from './index.scss'

export const duration = Number(`${s.fadeDuration}`.match(/^\d{1,}/g)?.pop())

export type DrawerLayoutProps = {
  open?: boolean
  onClickMask?(): void
  onClose?(): void
} & PropsWithChildren<Record<string, unknown>>

export default DrawerLayout
function DrawerLayout({
  open = false,
  children,
  onClickMask = () => undefined,
}: DrawerLayoutProps) {
  const [fadeOut, setFadeOut] = useState<boolean>(false)
  const [uiClosed, setUiClosed] = useState<boolean>(true)

  useEffect(() => {
    if (open) {
      setUiClosed(false)
      return
    }

    const v = vait.timeout(parseInt(s.fadeDuration))
    setFadeOut(true)
    v.then(() => {
      setFadeOut(false)
      setUiClosed(true)
    })
    return v.clear
  }, [open])

  if (uiClosed) {
    return null
  }

  return (
    <View
      className={`${s.DrawerLayout} ${fadeOut ? s.fadeOutMask : ''}`}
      onTap={onClickMask}
    >
      <View
        className={`${s.body} ${fadeOut ? s.bodyFadeOut : ''}`}
        onTap={(e) => e.stopPropagation()}
      >
        {children}
      </View>
    </View>
  )
}

type useDrawerLayout = (
  children: ReactNode,
  onClickMask?: () => void
) => [
  ReturnType<typeof DrawerLayout>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
]

export const useDrawerLayout: useDrawerLayout = (
  children,
  onClickMask = () => undefined
) => {
  const [open, setOpen] = useState<boolean>(false)

  return [
    <DrawerLayout open={open} onClickMask={onClickMask}>
      {children}
    </DrawerLayout>,
    open,
    setOpen,
  ]
}
