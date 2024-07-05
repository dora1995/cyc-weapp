import * as React from 'react'
import { View, Button } from 'remax/one'
import { Textarea } from 'remax/wechat'

import Modal, { useModal } from '.'

export default () => {
  const [openModal, setOpenModal] = React.useState(false)
  const [openTextareaModal, setOpenTextareaModal] = React.useState(false)

  const [funcModal, openFuncModal] = useModal()

  return (
    <View>
      <Button onTap={() => setOpenModal(true)}>组件引入写法Modal</Button>
      <Modal
        show={openModal}
        title="组件引入写法Modal"
        body="组件引入写法Modal"
        type="confirm"
        onConfirm={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
      />

      <Button onTap={() => setOpenTextareaModal(true)}>textarea的弹窗</Button>
      <Modal
        show={openTextareaModal}
        title="Textarea Modal"
        body={
          <Textarea
            value=""
            fixed // 注意要加上这个 fixed 属性
            style={{ width: '100%', textAlign: 'left', background: '#CCC' }}
          />
        }
        type="confirm"
        onConfirm={() => setOpenTextareaModal(false)}
        onCancel={() => setOpenTextareaModal(false)}
      />

      <Button
        onTap={() => {
          openFuncModal({
            type: 'alert',
            body: '你好',
            onConfirm(closeCurrentModal) {
              // closeCurrentModal 是关闭窗口
              closeCurrentModal()
            },
          })
        }}
      >
        函数调用风格
      </Button>
      <Button
        onTap={() => {
          openFuncModal({
            type: 'alert',
            body: '你好11111',
            onConfirm(closeCurrentModal) {
              // closeCurrentModal 是关闭窗口
              closeCurrentModal()

              openFuncModal({
                type: 'alert',
                body: '内部窗口',
                onConfirm(closeCurrentModal) {
                  // closeCurrentModal 是关闭窗口
                  closeCurrentModal()
                },
              })
            },
          })
          openFuncModal({
            type: 'alert',
            body: '你好222222222222',
            onConfirm(closeCurrentModal) {
              // closeCurrentModal 是关闭窗口
              closeCurrentModal()
            },
          })
        }}
      >
        函数调用风格1
      </Button>
      {funcModal}
    </View>
  )
}
