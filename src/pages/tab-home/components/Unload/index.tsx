import { Image, View } from '@remax/one'
import React from 'react'

import UnloadImage from './unload.svg'

import s from './index.scss'

export default () => {
  return (
    <View className={s.Wrapper}>
      <Image className={s.Image} src={UnloadImage} />
    </View>
  )
}
