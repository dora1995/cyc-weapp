import React from 'react'
import { Image, View } from '@remax/one'
import useLocation from '@/components/useLocation'

import s from './index.scss'

import LocateIcon from './locate.svg'

export default (): ReturnType<typeof useLocation> => {
  return useLocation({
    deny: () => (
      <View className={s.Locate}>
        <Image className={s.LocateIcon} src={LocateIcon} />
        <View className={s.LocateLabel}>无法获得当前定位，点此重新定位</View>
      </View>
    ),
    loaded: (locationCtx) => (
      <View className={s.Locate}>
        <Image className={s.LocateIcon} src={LocateIcon} />
        <View className={s.LocateLabel}>
          当前定位：{' '}
          {locationCtx ? `${locationCtx.city}${locationCtx.district}` : 'N/A'}
        </View>
      </View>
    ),
    loading: () => (
      <View className={s.Locate}>
        <Image className={s.LocateIcon} src={LocateIcon} />
        <View className={s.LocateLabel}>位置信息获取中...</View>
      </View>
    ),
    failure: (failure) => <>{`定位失败：${failure.message}`}</>,
  })
}
