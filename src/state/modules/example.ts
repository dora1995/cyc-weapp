import { useState } from 'react'
import { watchChange } from '@/state'

export default () => {
  const [count2, setCount2] = useState(0)
  const [count, setCount] = useState(0)

  // 在使用方式上，一定要像 useEffect 那样使用
  // ⚠️ 不能写在 if、循环、回调函数里头（也就是说要保证调用顺序是一致的）
  watchChange(
    /* 监听的值，作用与 useCallback 一致 */
    (state) => [state.example.count], // ⚠️ deps 不能变换长度
    (count) => {
      // 如果 state.example.count 发生了变动，这儿的回调函数就会执行一次
      // 回调函数参数相当于 [state.example.count]
      const timer = setTimeout(() => {
        setCount2(count)
      }, 1000)

      // 其实这个就是 useEffect 的再包装罢了
      return () => clearTimeout(timer)
    }
  )

  watchChange(
    (state) => [state.example.count2],
    (count2) => {
      console.log('count2 changed:', count2)
    }
  )

  return {
    count,
    count2,
    setCount2,
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
  }
}
