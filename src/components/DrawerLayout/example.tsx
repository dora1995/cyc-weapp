import React, { useState } from 'react'
import { View, Button } from 'remax/one'

import NavBar from '@/components/NavBar'
import DrawerLayout, {
  duration,
  useDrawerLayout,
} from '@/components/DrawerLayout'

export default () => {
  const [hookDrawerLayout, hookDLOpen, setHookDLOpen] = useDrawerLayout(
    <View style={{ background: 'white', color: '#333' }}>
      <View>TESTTEST</View>
      <View>TESTTEST</View>
      <View>TESTTEST</View>
      <Button
        onTap={() => {
          console.log('开始关闭钩子窗口')
          setHookDLOpen(false)
        }}
      >
        关闭
      </Button>
    </View>,
    () => {
      console.log('点到背景了')
    }
  )

  const [open, setOpen] = useState(false)

  return (
    <View>
      <NavBar
        backgroundColor="transparent"
        fillHeight={true}
        hideNavIcon
        title="Example"
      />

      <View>弹窗动画时长: {duration}</View>

      <Button
        onTap={() => {
          console.log('开始打开钩子窗口')
          setHookDLOpen(true)
        }}
      >
        打开钩子窗口
      </Button>
      {hookDrawerLayout}

      <Button
        onTap={() => {
          console.log('开始打开常规窗口')
          setOpen(true)
        }}
      >
        打开常规窗口
      </Button>
      <DrawerLayout
        open={open}
        onClickMask={() => {
          console.log('点到背景了')
        }}
      >
        <View style={{ background: 'white', color: '#333' }}>
          <View>TESTTEST</View>
          <View>TESTTEST</View>
          <View>TESTTEST</View>
          <Button
            onTap={() => {
              console.log('开始关闭常规窗口')
              setOpen(false)
            }}
          >
            关闭
          </Button>
        </View>
      </DrawerLayout>
    </View>
  )
}
