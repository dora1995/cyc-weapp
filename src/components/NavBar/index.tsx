import React, {
  CSSProperties,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { View, Image, navigateBack, reLaunch } from 'remax/one'
import { usePageEvent } from 'remax/macro'

import { pages as appPages } from '@/app.config'

import s from './index.scss'
import BackArrowIcon from './back-arrow.png'

export * from './useFillHeight'

const NAV_BAR_PADDING_BOTTOM: CSSProperties['height'] = s.NAV_BAR_PADDING_BOTTOM

const getSysInfo = () => {
  return wx.getSystemInfoSync()
}
const getMenuButtonBoundingClientRect = () => {
  return wx.getMenuButtonBoundingClientRect()
}

type CalcFillHeight = (menuRect?: {
  height: number
  top: number
}) => CSSProperties['height']

export const getFillHeightExpression: CalcFillHeight = (
  menuRect = getMenuButtonBoundingClientRect()
) => {
  return `(${menuRect.top}px + ${menuRect.height}px + ${NAV_BAR_PADDING_BOTTOM})`
}
export const getFillHeightCalcString: CalcFillHeight = (menuRect) => {
  return `calc${getFillHeightExpression(menuRect)}`
}

export const pagesStackJustOnePage = () => getCurrentPages().length === 1
export const backOrGotoHome = (gotoHome: boolean = pagesStackJustOnePage()) => {
  if (gotoHome) {
    reLaunch({ url: `/${appPages[0]}` })
  } else {
    navigateBack()
  }
}

export default ({
  fillHeight = true,
  hideNavIcon = false,
  background = '',
  title,
}: {
  fillHeight?: boolean
  hideNavIcon?: boolean
  background?: CSSProperties['background']
  title?: ReactNode
}) => {
  const [isTheOnlyPage, setIsTheOnlyPage] = useState(false)
  const initSysInfo = useMemo(() => getSysInfo(), [])
  const [sysInfo, setSysInfo] = useState(initSysInfo)

  const initMenuRect = useMemo(() => getMenuButtonBoundingClientRect(), [])
  const [menuRect, setMenuRect] = useState(initMenuRect)

  usePageEvent('onShow', () => {
    setMenuRect(getMenuButtonBoundingClientRect())
    setSysInfo(getSysInfo())
  })

  usePageEvent('onResize', () => {
    setMenuRect(getMenuButtonBoundingClientRect())
    setSysInfo(getSysInfo())
  })

  useEffect(() => {
    // 从页面栈判断当前页面是不是第一个页面
    setIsTheOnlyPage(pagesStackJustOnePage())
  }, [])

  const handleClickLeftIcon = useCallback(() => {
    backOrGotoHome(isTheOnlyPage)
  }, [isTheOnlyPage])

  const wrapperFillHeight = useMemo(() => {
    if (fillHeight) {
      return getFillHeightCalcString({
        height: menuRect.height,
        top: menuRect.top,
      })
    } else {
      return ''
    }
  }, [fillHeight, menuRect.height, menuRect.top])

  const LeftIconWrapper = useMemo(() => {
    if (hideNavIcon) {
      return null
    }

    return (
      <View className={s.LeftIconWrapper} onTap={handleClickLeftIcon}>
        <Image className={s.LeftIcon} src={BackArrowIcon} />
        <View className={s.LeftIconTapArea}></View>
      </View>
    )
  }, [handleClickLeftIcon, hideNavIcon])

  const navBarStyle: CSSProperties = useMemo(
    () => ({
      width: `calc(100vw - ${sysInfo.windowWidth - menuRect.right}px * 2)`,
      // width: '100vw',
      paddingLeft: `${sysInfo.windowWidth - menuRect.right}px`,
      paddingRight: `${sysInfo.windowWidth - menuRect.right}px`,
      paddingTop: `${menuRect.top}px`,
      height: `${menuRect.height}px`,
      paddingBottom: NAV_BAR_PADDING_BOTTOM,
      background,
    }),
    [
      background,
      menuRect.height,
      menuRect.right,
      menuRect.top,
      sysInfo.windowWidth,
    ]
  )

  return useMemo(
    () => (
      <View
        className={s.NavBarWrapper}
        style={{
          paddingTop: wrapperFillHeight,
        }}
      >
        <View className={`${s.NavBar}`} style={navBarStyle}>
          <View className={s.MiddleTitle}>
            {LeftIconWrapper}
            {title}
          </View>
        </View>
      </View>
    ),
    [LeftIconWrapper, navBarStyle, title, wrapperFillHeight]
  )
}
