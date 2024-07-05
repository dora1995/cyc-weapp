declare module '*.svg' {
  const fileUrl: string
  export default fileUrl
}
declare module '*.png' {
  const fileUrl: string
  export default fileUrl
}
declare module '*.scss' {
  const classes: { [key: string]: string }
  export default classes
}
declare module '*.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '@/px2viewport.config' {
  declare const px2viewportConfig: {
    viewportWidth: number
    viewportHeight: number
    unitPrecision: number
    viewportUnit: 'vw' | 'vh'
    selectorBlackList: Array<string>
    minPixelValue: number
    mediaQuery: boolean
  }

  export default px2viewportConfig
}

type ServerDateTime = string

declare const wxLog: {
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
  setFilterMsg(msg: string): void
  addFilterMsg(msg: string): void
}
