import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import { RequestError } from '@/api'
import { useModal } from '@/components/Modal'
import UpdateUserInfoWindow, {
  Props as UpdateUserInfoWindowProps,
  ANIMATION_TIMING as UpdateUserInfoAnimationTiming,
} from '@/components/UpdateUserInfo/Window'

export type ErrorType = RequestError | Error

export type RetryCallback = (closeModal: () => void) => void
export type CancelCallback = (closeModal: () => void) => void

interface SetErrorOptionsBasic {
  error: ErrorType
  description?: string

  userUpdateWindowProps?: { icon?: boolean }
  userUpdateSuccess?: RetryCallback
  userUpdateCancel?: CancelCallback
}

interface SetErrorOptions extends SetErrorOptionsBasic {
  retry?: RetryCallback
  cancel?: CancelCallback
}
export type SetError = (
  error: ErrorType | SetErrorOptions,
  secondArg?: string | RetryCallback,
  userUpdateSuccess?: RetryCallback,
  userUpdateCancel?: RetryCallback
) => void

export type SetErrorWithDesc = (
  desc: string
) => (errorType: ErrorType, retryCallback?: RetryCallback) => void

export interface ErrorContainer extends SetErrorOptionsBasic {
  ignoreUserUpdateRequired?: boolean
  retryCallback?: SetErrorOptions['retry']
  cancelCallback?: SetErrorOptions['cancel']
}

export type RequireUserInfo = (opts: {
  userUpdateWindowProps?: { icon?: boolean }
  userUpdateSuccess?: RetryCallback
  userUpdateCancel?: CancelCallback
}) => void

export default useErrorContainer
function useErrorContainer({
  initError = null,
  errorTitle: defaultErrorTitle,
  openModal,
  errorConfirmText,
  errorRetryText,

  UpdateUsetInfoWindowIcon,
}: {
  openModal: ReturnType<typeof useModal>[1]
  initError?: ErrorContainer | null
  errorTitle: string
  errorConfirmText: string
  errorRetryText: string

  UpdateUsetInfoWindowIcon: boolean
}): {
  cancelRequireUserInfo: () => void
  requireUserInfo: RequireUserInfo
  updateUsetInfoWindowNode: ReactNode
  errorContainer: ErrorContainer | null
  pageCtxSetError: SetError
  pageCtxSetErrorWithDesc: SetErrorWithDesc
} {
  const [errorContainer, setErrorContainer] = useState<ErrorContainer | null>(
    initError
  )
  const [
    userInfoRequired,
    setUserInfoRequired,
  ] = useState<UpdateUserInfoWindowProps>({
    show: false,
    icon: false,
    onUpdated: () => undefined,
    onFailure: () => undefined,
    onClickClose: () => undefined,
  })

  const updateUsetInfoWindowNode = useMemo(
    () => <UpdateUserInfoWindow {...userInfoRequired} />,
    [userInfoRequired]
  )
  const closeUserInfoRequired = useCallback(() => {
    setUserInfoRequired((item) => ({
      ...item,
      show: false,
    }))
  }, [])

  const openErrorModal = useCallback(
    (errorContainer: ErrorContainer) => {
      const {
        error,
        description,
        retryCallback,
        cancelCallback,

        ignoreUserUpdateRequired = true,
        userUpdateSuccess,
        userUpdateCancel,
        userUpdateWindowProps = {
          icon: UpdateUsetInfoWindowIcon,
        },
      } = errorContainer

      let modalTitle = defaultErrorTitle

      if (error instanceof RequestError) {
        // 由 API 请求而来的错误
        if (error.isSilent) {
          return
        }

        // if (error.code === 40104 && !ignoreUserUpdateRequired) {
        //   // 未提交用户资料的情况
        //   return setUserInfoRequired((item) => ({
        //     ...item,
        //     ...userUpdateWindowProps,
        //     show: true,
        //     onUpdated: () => {
        //       if (userUpdateSuccess) {
        //         userUpdateSuccess(closeUserInfoRequired)
        //       } else {
        //         closeUserInfoRequired()
        //         setTimeout(() => {
        //           wx.showToast({
        //             title: '登录成功',
        //             icon: 'success',
        //             duration: 1500,
        //           })
        //         }, UpdateUserInfoAnimationTiming * 2)
        //       }
        //     },
        //     onClickClose: () => {
        //       if (userUpdateCancel) {
        //         userUpdateCancel(closeUserInfoRequired)
        //       } else {
        //         closeUserInfoRequired()
        //       }
        //     },
        //     onFailure: (failureError) => {
        //       openErrorModal({
        //         error: failureError,
        //         description: '微信登录失败',
        //       })
        //     },
        //   }))
        // }

        if (error.description) {
          // 如果有描述的话，就修改弹窗标题
          modalTitle = `${error.description}失败`
        }
      }

      if (description) {
        modalTitle = description
      }

      if (retryCallback) {
        openModal({
          zIndex: 10001,
          type: 'confirm',
          cancelText: errorConfirmText,
          confirmText: errorRetryText,
          title: modalTitle,
          body: error.message,
          onConfirm: retryCallback,
          onCancel: cancelCallback,
        })
      } else {
        openModal({
          zIndex: 10001,
          type: 'alert',
          confirmText: errorConfirmText,
          title: modalTitle,
          body: error.message,
        })
      }
    },
    [
      UpdateUsetInfoWindowIcon,
      defaultErrorTitle,
      errorConfirmText,
      errorRetryText,
      openModal,
    ]
  )

  const pageCtxSetError = useCallback<SetError>(
    (error, descOrCallback, retryCallback, cancelCallback) => {
      let description: string = ''
      if (descOrCallback) {
        if (typeof descOrCallback === 'string') {
          description = descOrCallback
        } else {
          retryCallback = descOrCallback
        }
      }

      if (error instanceof Error) {
        openErrorModal({
          ignoreUserUpdateRequired: true,

          error,
          description,
          retryCallback,
          cancelCallback,
        })
      } else {
        const options = error
        openErrorModal({
          ignoreUserUpdateRequired: false,

          error: options.error,
          description: options.description,
          retryCallback: options.retry,
          cancelCallback: options.cancel,

          userUpdateWindowProps: options.userUpdateWindowProps,
          userUpdateSuccess: options.userUpdateSuccess,
          userUpdateCancel: options.userUpdateCancel,
        })
      }
    },
    [openErrorModal]
  )

  const requireUserInfo = useCallback<RequireUserInfo>(
    (opts) => {
      openErrorModal({
        ...opts,
        ignoreUserUpdateRequired: false,
        error: new RequestError('', 40104, {}, false, ''),
      })
    },
    [openErrorModal]
  )

  const cancelRequireUserInfo = useCallback(() => {
    closeUserInfoRequired()
  }, [closeUserInfoRequired])

  const pageCtxSetErrorWithDesc = useCallback<SetErrorWithDesc>(
    (description) => {
      return (error, callback) => {
        return pageCtxSetError(error, description, callback)
      }
    },
    [pageCtxSetError]
  )

  return {
    cancelRequireUserInfo,
    requireUserInfo,
    updateUsetInfoWindowNode,
    errorContainer,
    pageCtxSetError,
    pageCtxSetErrorWithDesc,
  }
}
