import { CSSProperties } from 'react'
import px2viewportConfig from '@/px2viewport.config'

const toVw = (val: number): CSSProperties['width'] => {
  const { viewportWidth } = px2viewportConfig
  return `${(val / viewportWidth) * 100}vw`
}

export default toVw
