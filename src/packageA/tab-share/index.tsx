import react from 'react'
import createPage from '@/components/CreatePage'
import { usePageEvent } from 'remax/macro'
import useQueryWithScene from '@/hooks/useQueryWithScene'

export default createPage(() => {
  const { tabPage } = useQueryWithScene()

  usePageEvent('onLoad', () => {
    wx.reLaunch({ url: tabPage || '' })
  })

  return null
})
