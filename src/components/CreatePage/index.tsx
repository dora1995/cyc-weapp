import React, { useMemo } from 'react'
import { useLoading, loadingType } from '@/components/Loading'
import {
  useModal,
  useAlertWithModal,
  useConfirmWithModal,
} from '@/components/Modal'

import { useFromDetecting } from '@/state/from'

import useErrorContainer, {
  ErrorType,
  SetError,
  SetErrorWithDesc,
  ErrorContainer,
  RequireUserInfo,
} from './useErrorContainer'

export type PageCtx = {
  loading: loadingType
  error?: ErrorType
  setLoading: React.Dispatch<React.SetStateAction<loadingType>>
  setError: SetError
  setErrorWithDesc: SetErrorWithDesc
  openModal: ReturnType<typeof useModal>[1]
  alert: ReturnType<typeof useAlertWithModal>
  confirm: ReturnType<typeof useConfirmWithModal>
  requireUserInfo: RequireUserInfo
  cancelRequireUserInfo: () => void
}

type CreatePage = (
  PageComponent: React.ComponentType<PageCtx>,
  options?: {
    loading?: boolean
    error?: ErrorContainer
    errorConfirmText?: string
    errorTitle?: string
    errorRetryText?: string

    UpdateUsetInfoWindowIcon?: boolean
  }
) => React.ComponentType

const createPage: CreatePage = (
  PageComponent,
  {
    loading: initLoading = false,
    error: initError = null,
    errorConfirmText = '确定',
    errorTitle = '出错',
    errorRetryText = '重试',

    UpdateUsetInfoWindowIcon = true,
  } = {}
) => {
  return () => {
    useFromDetecting()

    const [loadingNode, setLoading, loading] = useLoading({
      loading: initLoading,
    })

    const [modalNode, openModal] = useModal()
    const alert = useAlertWithModal(openModal)
    const confirm = useConfirmWithModal(openModal)

    const {
      cancelRequireUserInfo,
      updateUsetInfoWindowNode,
      requireUserInfo,
      errorContainer,
      pageCtxSetError,
      pageCtxSetErrorWithDesc,
    } = useErrorContainer({
      openModal,
      initError,
      errorTitle,
      errorConfirmText,
      errorRetryText,

      UpdateUsetInfoWindowIcon,
    })

    const pageComponentNode = useMemo(
      () => (
        <PageComponent
          alert={alert}
          confirm={confirm}
          loading={loading}
          setLoading={setLoading}
          error={errorContainer?.error}
          setError={pageCtxSetError}
          setErrorWithDesc={pageCtxSetErrorWithDesc}
          openModal={openModal}
          requireUserInfo={requireUserInfo}
          cancelRequireUserInfo={cancelRequireUserInfo}
        />
      ),
      [
        alert,
        cancelRequireUserInfo,
        confirm,
        errorContainer?.error,
        loading,
        openModal,
        pageCtxSetError,
        pageCtxSetErrorWithDesc,
        requireUserInfo,
        setLoading,
      ]
    )

    return (
      <>
        {pageComponentNode}
        {modalNode}
        {updateUsetInfoWindowNode}
        {loadingNode}
      </>
    )
  }
}
export default createPage
