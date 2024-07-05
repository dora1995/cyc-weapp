import React, { useMemo } from 'react'
import { Image, View, Text } from '@remax/one'

import LeftIcon from './LeftIcon.svg'

import s from './index.scss'
import Empty from '../Empty'

type Props = {
  count: number
  list: Array<{ id: number; school_name: string, distance?: string }>
  onTapIndex(idx: number): void
  currentTabIndex: number
}
export default ({ list, count, onTapIndex, currentTabIndex }: Props) => {
  const listingElement = useMemo(() => {
    if (count === 0) {
      return <Empty />
    }

    return (
      <View className={s.SchoolList}>
        {list.map((item, idx) => {
          return (
            <View
              key={item.id}
              className={s.SchoolItem}
              onTap={() => onTapIndex(idx)}
            >
              <Image className={s.LeftIcon} src={LeftIcon} />
              <View className={s.SchoolName}>{item.school_name}{ item.distance ? <Text className={s.distance}>{`(距离约${item.distance}公里)`}</Text> : null }</View>
            </View>
          )
        })}
      </View>
    )
  }, [count, list, onTapIndex])

  return (
    <View className={s.Wrapper}>
      <View className={s.Count}>
        {count} 条搜索结果 { currentTabIndex == 0 ? `(当前定位统筹范围)` : ''} <Text className={s.Tips}>(信息仅供参考)</Text>
      </View>
      {listingElement}
    </View>
  )
}
