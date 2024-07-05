import React from 'react'
import { View, WebView } from 'remax/one'
import s from './index.scss'
import createPage from '@/components/CreatePage'
export default createPage((pageCtx) => {
  return (
    <View className={s.Page}>
      {/* <NavBar
        hideNavIcon={true}
        fillHeight={true}
        title="广州小学信息查一查"
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
      /> */}
      <WebView src="https://mp.weixin.qq.com/s?__biz=MzkzOTIxMTc4NA==&mid=2247525902&idx=1&sn=4724c8f93a594debe535c37ca433acb7&chksm=c2f64b69f581c27fd8ac7475a63034024f6ec4fc39d120613d9bbc6b0f9805ab201fbfaee785&token=152197394&lang=zh_CN#rd" />
    </View>
  )
})
