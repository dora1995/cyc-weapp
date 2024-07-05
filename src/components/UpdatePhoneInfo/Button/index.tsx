import React, { PropsWithChildren } from 'react'
import { Button, ButtonProps } from 'remax/wechat'
import { useLoading } from '@/components/Loading'

import { useAppState } from '@/state'
import { submitPhone } from '@/api/auth'

import s from './index.scss'

type DetailType = {
  encryptedData: string
  errMsg: string
  iv: string
  rawData: string
  signature: string
}

let isProcessing = false

export default ({
  children = '更新手机资料',
  updateBefore = () => Promise.resolve(true),
  onUpdated,
  onFailure = () => undefined,
  className,
  style,
  ...buttonProps
}: ButtonProps &
  PropsWithChildren<{
    updateBefore?: () => Promise<boolean>
    onUpdated: (data: any) => void
    onFailure?: (err: any) => void
  }>) => {
  const [loadingNode, setLoading] = useLoading()
  const { setToken } = useAppState()

  const handleGetPhoneNumber = async ({ detail }: { detail: DetailType }) => {
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
        let token = ''
        await submitPhone({
          encryptedData: detail.encryptedData,
          iv: detail.iv,
        }).then((res) => {
          token = res.token
          setToken(token)
          onUpdated(res)
        })
      }
    } catch (err) {
      onFailure(err)
    } finally {
      setLoading(false)
      isProcessing = false
    }
  }

  return (
    <>
      <Button
        {...buttonProps}
        plain
        className={`${s.UpdateButton} ${className || ''}`}
        style={style}
        openType="getPhoneNumber|agreePrivacyAuthorization"
        onTap={() => setLoading(true)}
        onGetPhoneNumber={handleGetPhoneNumber}
        lang="zh_CN"
      >
        {children}
      </Button>
      {loadingNode}
    </>
  )
}
