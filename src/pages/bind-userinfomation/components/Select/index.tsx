import React, { CSSProperties, useMemo, useState } from 'react'
import { View, Image } from '@remax/one'
import { ScrollView } from '@remax/wechat'

import WindowLayout from '@/components/WindowLayout'
import classNames from 'classNames'
import s from './index.scss'
import Icon from './Icon.svg'

export default <ID extends string, IDVal extends string, Title extends string>({
  idKey,
  titleKey,
  currentId,
  list,
  onSelect,
  placeholder,
  placeholderColor,
  className,
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
  const [val, setVal] = useState<any[]>(currentId ? currentId.split(',') : [])
  const currentIdx = list
    .map((item) => {
      return item[idKey] as IDVal
    })
    .indexOf(currentId)
  const changeSelect = (v) => {
    if (v === '暂无意向') {
      setVal(['暂无意向'])
    } else {
      const vv = [...val]

      const index = val.indexOf(v)
      console.log('index', index)
      console.log('val', val)
      if (index >= 0) {
        vv.splice(index, 1)
      } else {
        vv.push(v)
        const i = val.indexOf('暂无意向')
        if (i >= 0) {
          console.log('暂无意向')

          vv.splice(i, 1)
        }
      }
      setVal(vv)
    }
  }
  const listItems = useMemo(() => {
    return list.map((item, idx) => {
      return (
        <View
          key={idx}
          className={s.ListItem}
          onTap={() => {
            // setShowLayout(false)
            changeSelect(item[idKey])
          }}
        >
          {item[titleKey]}
          {val.includes(item[idKey]) && <text>✅</text>}
        </View>
      )
    })
  }, [idKey, list, onSelect, titleKey, val])

  const currentValueElement = useMemo(() => {
    if (currentId) {
      return <View className={s.Current}>{currentId}</View>
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
  }, [currentId, list, placeholder, placeholderColor, titleKey])

  return (
    <>
      <View
        className={classNames(s.Wrapper, className)}
        onTap={() => setShowLayout(true)}
      >
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
          <View className={s.btn}>
            <View className={s.cbtn} onTap={() => setShowLayout(false)}>
              取消
            </View>
            <View
              onTap={() => {
                onSelect([...val].join(','))
                setShowLayout(false)
              }}
              className={s.sbtn}
            >
              确定
            </View>
          </View>
        </ScrollView>
      </WindowLayout>
    </>
  )
}
