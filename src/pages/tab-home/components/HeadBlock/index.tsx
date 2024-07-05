import React, { useMemo } from 'react'
import { View, Image } from 'remax/one'
import { getFillHeightExpression } from '@/components/NavBar'
import toVw from '@/utils/toVw'

import s from './index.scss'
import LogoImage from '@/imgs/logo_youxiao.png'
import LogoZImage from '@/imgs/logo_zuoyue.png'
import MatrixPointImage from './matrix-point.png'

import Icon1 from '@/imgs/icon_top_location@2x.png'
import Icon2 from '@/imgs/icon_top_search@2x.png'
import Icon3 from '@/imgs/icon_top_classify@2x.png'
import Icon4 from '@/imgs/icon_top_groupchat@2x.png'

const IconList = [Icon1, Icon2, Icon3, Icon4]
export type Props = {
  tabs: string[]
  currentIndex: number
  onTapTabIndex(tabIndex: number): void
}
export default ({ tabs, currentIndex, onTapTabIndex }: Props) => {
  const navBarHeight = getFillHeightExpression()
  const HeadBlockHeight = useMemo(() => {
    // return `calc(${navBarHeight} + ${toVw(131)})`
    return `calc(${navBarHeight})`
  }, [])

  return (
    <View className={s.HeadBlock} style={{ paddingTop: HeadBlockHeight}}>
      {/* <View className={s.top}></View> */}
      <Image className={s.MatrixPointImage} src={MatrixPointImage} />
      <View className={s.imgG}>
        <Image className={s.LogoImageZ} src={LogoZImage} />
        <Image className={s.LogoImage} src={LogoImage} />
      </View>
      <View className={s.TabArea}>
        {tabs.map((tabName, tabIndex) => {
          const isHighlight = tabIndex === currentIndex
          return (
            <View
              key={tabIndex}
              className={`${s.TabItem} ${isHighlight ? s.TabHighlight : ''}`}
              onTap={() => onTapTabIndex(tabIndex)}
            >
              <Image className={s.tabIcon} src={IconList[tabIndex]} />
              <View className={`${s.tabText} ${isHighlight ? s.TabHighlight : ''}`}>{tabName}</View>
              {!isHighlight ? null : <View className={s.HighlightLine}></View>}
            </View>
          )
        })}
      </View>
    </View>
  )
}
