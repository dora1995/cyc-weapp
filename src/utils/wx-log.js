const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

export default {
  info(...args) {
    if (!log) return
    log.info(...args)
  },

  warn(...args) {
    if (!log) return
    log.warn(...args)
  },

  error(...args) {
    if (!log) return
    log.error(...args)
  },

  // 从基础库2.7.3开始支持
  setFilterMsg(msg) {
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    log.setFilterMsg(msg)
  },

  // 从基础库2.8.1开始支持
  addFilterMsg(msg) {
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    log.addFilterMsg(msg)
  },
}
