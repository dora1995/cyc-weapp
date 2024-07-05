import React, { useEffect, useState, ReactNode } from 'react'

export type loadingType = boolean | string

type Props = {
  loading: loadingType
  defaultTitle?: string
}

export default Loading
function Loading({ loading, defaultTitle = '加载中' }: Props) {
  useEffect(() => {
    if (loading) {
      if (typeof loading === 'string') {
        wx.showLoading({ title: loading })
      } else {
        wx.showLoading({ title: defaultTitle })
      }
    } else {
      wx.hideLoading()
    }

    return () => {
      wx.hideLoading()
    }
  }, [loading, defaultTitle])
  return null
}

const useLoadingDefaultProps = Object.freeze({ loading: false })

export const useLoading = ({
  loading: initLoading = false,
  defaultTitle,
}: Props = useLoadingDefaultProps) => {
  const [loading, setLoading] = useState<loadingType>(initLoading)
  return [
    <Loading defaultTitle={defaultTitle} loading={loading} />,
    setLoading,
    loading,
  ] as const
}
