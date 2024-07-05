import dayjs from 'dayjs'

/**
 * 格式化时间
 * @param date 服务器返回的时间字符串
 * @param pattern 格式化的格式
 */
export const formatTime = (
  date: ServerDateTime,
  pattern: string = 'YYYY/MM/DD HH:mm:ss'
): string => dayjs(date).format(pattern)
