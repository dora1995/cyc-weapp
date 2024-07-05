import React, { CSSProperties } from 'react'
import { View } from 'remax/one'
import WindowLayout, { Events as WLEvents } from '@/components/WindowLayout'

import s from './index.scss'

type Props = {
  zIndex?: CSSProperties['zIndex']
  show: boolean
  title: string
} & WLEvents

export default ({ onTapBackground, onClosed, zIndex, show, title }: Props) => {
  return (
    <WindowLayout
      backgroundColor="transparent"
      zIndex={zIndex}
      show={show}
      onTapBackground={onTapBackground}
      onClosed={onClosed}
    >
      <View className={s.Toast}>{title}</View>
    </WindowLayout>
  )
}
