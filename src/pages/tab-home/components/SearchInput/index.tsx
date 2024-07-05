import React, { useCallback } from 'react'
import { Input, View, Image, InputProps } from '@remax/one'
import s from './index.scss'

import SearchIcon from './SearchIcon.svg'

export type Props = {
  placeholder?: InputProps['placeholder']
  value: string
  onInput(val: string): void
  onConfirm(type: 'KEYBOARD' | 'TAP'): void
}
export default ({ placeholder, value, onInput, onConfirm }: Props) => {
  return (
    <View className={s.Wrapper}>
      <Input
        className={s.Input}
        placeholder={placeholder}
        value={value}
        onInput={(e) => {
          onInput(e.target.value)
        }}
        onConfirm={() => onConfirm('KEYBOARD')}
      />

      <View className={s.SearchIconWrapper} onTap={() => onConfirm('TAP')}>
        <Image className={s.SearchIcon} src={SearchIcon} />
      </View>
    </View>
  )
}
