import { Image, View } from '@remax/one'
import React from 'react'

import LoadingImage from './Loading.svg'

import s from './index.scss'

export default () => {
  return (
    <View className={s.Wrapper}>
      <Image className={s.Image} src={LoadingImage} />
      <View className={s.Label}>加载中</View>
    </View>
  )
}
