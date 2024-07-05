import * as React from 'react'
import { View, Text } from 'remax/one'
import NavBar from './'

export default () => {
  return (
    <View>
      {/* backgroundColor 背景色设定，值为 CSS background-color 允许的字段，不传入则为 #34313d */}
      <NavBar backgroundColor="transparent" title="标题" />
      <View style={{ color: 'white' }}>
        agjiosajgoisajgioj asgjiosa gjaiosgjioasjgi
      </View>
    </View>
  )
}
