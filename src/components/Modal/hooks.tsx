import vait from 'vait'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'

import Modal, { NormalProps } from '.'

let modalId = 0

type useModalProps = NormalProps & {
  onConfirm?: (hideCurrentModal: () => void) => void
  onCancel?: (hideCurrentModal: () => void) => void
}
type ModalStackId = number
type ModalStackItem = useModalProps & {
  $id: ModalStackId
}
export function useModal(): [ReactNode, (props: useModalProps) => void] {
  const [stack, setStack] = useState<ModalStackItem[]>([])

  const removeModal = useCallback((findId: ModalStackId) => {
    setStack((currentStack) =>
      currentStack.filter((props) => findId !== props.$id)
    )
  }, [])

  const hideModal = useCallback((findId: ModalStackId) => {
    setStack((currentStack) =>
      currentStack.map((props) => ({
        ...props,
        show: props.$id !== findId,
      }))
    )
  }, [])

  const modalNodes = useMemo(
    () =>
      stack.map((props) => {
        const closeModal = () => hideModal(props.$id)

        return (
          <Modal
            key={props.$id}
            {...props}
            onConfirm={() => {
              if (props.onConfirm) {
                props.onConfirm(closeModal)
              } else {
                closeModal()
              }
            }}
            onCancel={() => {
              if (props.onCancel) {
                props.onCancel(closeModal)
              } else {
                closeModal()
              }
            }}
          />
        )
      }),
    [hideModal, stack]
  )

  const openModal = useCallback(
    (props: useModalProps) => {
      setStack((currentStack) => {
        const $id = modalId++
        return [
          ...currentStack,
          { ...props, $id, onClosed: () => removeModal($id) },
        ]
      })
    },
    [removeModal]
  )

  return [modalNodes, openModal]
}

export const useAlertWithModal = (
  openModal: ReturnType<typeof useModal>[1]
): ((alertText: ReactNode) => ReturnType<typeof vait>) => {
  return useCallback(
    (alertText: ReactNode) => {
      const alertV = vait()

      openModal({
        type: 'alert',
        body: alertText,
        onConfirm(closeModal) {
          closeModal()
          alertV.pass(true)
        },
      })

      return alertV
    },
    [openModal]
  )
}
export const useAlert = (): [
  ReactNode,
  ReturnType<typeof useAlertWithModal>
] => {
  const [modal, openModal] = useModal()
  return [modal, useAlertWithModal(openModal)]
}

export const useConfirmWithModal = (
  openModal: ReturnType<typeof useModal>[1]
): ((alertText: ReactNode) => ReturnType<typeof vait>) => {
  return useCallback(
    (confirmText: ReactNode) => {
      const alertV = vait<boolean, Error>()

      openModal({
        type: 'confirm',
        body: confirmText,
        onConfirm(closeModal) {
          closeModal()
          alertV.pass(true)
        },
        onCancel(closeModal) {
          closeModal()
          alertV.pass(false)
        },
      })

      return alertV
    },
    [openModal]
  )
}
export const useConfirm = (): [
  ReactNode,
  ReturnType<typeof useConfirmWithModal>
] => {
  const [modal, openModal] = useModal()
  return [modal, useConfirmWithModal(openModal)]
}
