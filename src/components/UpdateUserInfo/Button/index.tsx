import React, { PropsWithChildren, useCallback, useMemo } from 'react'
import { Button, ButtonProps } from 'remax/wechat'
import { useLoading } from '@/components/Loading'

import { useAppState } from '@/state'
import { refreshUserProfile, refreshWeappUserInfo } from '@/api/auth'

import s from './index.scss'

type DetailType = WechatMiniprogram.GetUserProfileSuccessCallbackResult & {
  encryptedData: string
  errMsg: string
  iv: string
  rawData: string
  signature: string
}

let isProcessing = false

const canUseGetUserProfile = Boolean(wx.getUserProfile)

export default ({
  children = '更新用户资料',
  updateBefore,
  onUpdated,
  onFailure = () => undefined,
  className,
  style,
  ...buttonProps
}: ButtonProps &
  PropsWithChildren<{
    updateBefore: () => Promise<boolean>
    onUpdated: () => void
    onFailure?: (err: any) => void
  }>) => {
  const [loadingNode, setLoading] = useLoading()
  const { setToken } = useAppState()

  const handleGetUserInfo = useCallback(
    async ({ detail }: { detail: DetailType }) => {
      if (isProcessing) {
        setLoading(false)
        return
      } else {
        isProcessing = true
      }

      try {
        const isContinue = await updateBefore()
        if (!isContinue) {
          return
        }

        if (/ok/.test(detail.errMsg)) {
          const { token } = await refreshWeappUserInfo({
            encryptedData: detail.encryptedData,
            iv: detail.iv,
          })
          setToken(token)
          setTimeout(() => {
            onUpdated()
          })
        }
      } catch (err) {
        onFailure(err)
      } finally {
        setLoading(false)
        isProcessing = false
      }
    },
    [onFailure, onUpdated, setLoading, setToken, updateBefore]
  )

  const handleGetUserProfile = useCallback(
    async (detail: DetailType) => {
      if (isProcessing) {
        return
      } else {
        isProcessing = true
      }

      try {
        const isContinue = await updateBefore()
        if (!isContinue) {
          return
        }

        if (/ok/.test(detail.errMsg)) {
          const { token } = await refreshUserProfile({
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            userInfo: detail.userInfo,
          })
          setToken(token)
          setTimeout(() => {
            onUpdated()
          })
        }
      } catch (err) {
        onFailure(err)
      } finally {
        isProcessing = false
      }
    },
    [onFailure, onUpdated, setToken, updateBefore]
  )

  const handleTapGetUserProfile = useCallback(() => {
    setLoading(true)

    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用于完善会员资料',
      success: async (res) => {
        try {
          setLoading(true)
          await handleGetUserProfile(res as DetailType)
        } finally {
          setLoading(false)
        }
      },
      fail(err) {
        setLoading(false)
        if (!/deny|denied/.test(err.errMsg)) {
          console.error('err', err)
          onFailure(new Error(err.errMsg))
        }
      },
    })
  }, [handleGetUserProfile, onFailure, setLoading])

  return (
    <>
      {useMemo(() => {
        // 如果可以使用新接口 getUserProfile，则不再使用老的 wx.getUserInfo
        if (canUseGetUserProfile) {
          return (
            <Button
              {...buttonProps}
              plain
              className={`${s.UpdateButton} ${className || ''}`}
              style={style}
              onTap={handleTapGetUserProfile}
            >
              {children}
            </Button>
          )
        } else {
          return (
            <Button
              {...buttonProps}
              plain
              className={`${s.UpdateButton} ${className || ''}`}
              style={style}
              openType="getUserInfo|agreePrivacyAuthorization"
              lang="zh_CN"
              onTap={() => setLoading(true)}
              onGetUserInfo={handleGetUserInfo}
            >
              {children}
            </Button>
          )
        }
      }, [
        buttonProps,
        children,
        className,
        handleGetUserInfo,
        handleTapGetUserProfile,
        setLoading,
        style,
      ])}

      {loadingNode}
    </>
  )
}
