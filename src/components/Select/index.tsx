import React, { CSSProperties, useMemo, useState } from 'react'
import { View, Image } from '@remax/one'
import { ScrollView } from '@remax/wechat'

import WindowLayout from '@/components/WindowLayout'
import classNames from 'classNames'
import s from './index.scss'
import Icon from './Icon.svg'

export default <
  ID extends string,
  IDVal extends unknown,
  Title extends string
>({
  idKey,
  titleKey,
  currentId,
  list,
  onSelect,
  placeholder,
  placeholderColor,
  className
}: {
  idKey: ID
  titleKey: Title
  className?: string
  currentId: IDVal
  list: Array<
    Record<string, unknown> & Record<Title, string> & Record<ID, IDVal>
  >
  placeholder: string
  placeholderColor?: CSSProperties['color']

  onSelect(id: IDVal): void
}) => {
  const [showLayout, setShowLayout] = useState(false)

  const currentIdx = list
    .map((item) => {
      return item[idKey] as IDVal
    })
    .indexOf(currentId)

  const listItems = useMemo(() => {
    return list.map((item, idx) => {
      return (
        <View
          key={idx}
          className={s.ListItem}
          onTap={() => {
            setShowLayout(false)
            onSelect(item[idKey])
          }}
        >
          {item[titleKey]}
        </View>
      )
    })
  }, [idKey, list, onSelect, titleKey])

  const currentValueElement = useMemo(() => {
    if (currentIdx >= 0) {
      return <View className={s.Current}>{list[currentIdx][titleKey]}</View>
    } else {
      return (
        <View
          className={`${s.Current} ${s.Placeholder}`}
          style={{ color: placeholderColor }}
        >
          {placeholder}
        </View>
      )
    }
  }, [currentIdx, list, placeholder, placeholderColor, titleKey])

  return (
    <>
      <View className={classNames(s.Wrapper, className)} onTap={() => setShowLayout(true)}>
        {currentValueElement}
        <Image className={s.Icon} src={Icon} />
      </View>

      <WindowLayout
        zIndex={9999}
        show={showLayout}
        onTapBackground={() => setShowLayout(false)}
      >
        <ScrollView scrollY className={s.SelectList}>
          {listItems}
        </ScrollView>
      </WindowLayout>
    </>
  )
}
