import { getGroupchat } from '@/api/school';
import createPage from '@/components/CreatePage';
import React, { useState } from 'react'
import { useQuery } from 'remax';
import { usePageEvent } from 'remax/macro';
import { View } from 'remax/one';
import s from './index.scss'
import NavBar from '@/components/NavBar';
import { Image } from 'remax/one';

export default createPage((pageCtx) => {
  const query = useQuery()
  const [imgUrls, setImgUrls] = useState<string[]>([])
  const { type } = query
  function getImg() {
    getGroupchat().then((res) => {
      if (type === 'en' && res.enrollment_pic) {
        setImgUrls(res.enrollment_pic.split(','))
      } else if (type === 'mp' && res.mp_pic) {
        setImgUrls(res.mp_pic.split(','))
      }
    }).catch(pageCtx.setError)
  }
  usePageEvent('onLoad', () => {
    getImg()
  })


  return (
    <View className={s.Page}>
      <NavBar
        title="查看示例"
        background="linear-gradient(90deg, #1469E1 0%, #1996E6 100%)"
      />
      <View className={s.SearchArea}>
        {imgUrls.map((img, index) => {
          return <Image key={index} mode='widthFix' className={s.intoQrImg} src={img} />
        })}
      </View>
    </View>
  )
})
