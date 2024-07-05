import { useCallback, useEffect, useMemo, useState } from 'react'
import { getFillHeightExpression } from './'
import { usePageEvent } from 'remax/macro'

export const useFillHeight = () => {
  const initedFillHeight = useMemo(() => getFillHeightExpression(), [])

  const [fillHeight, setFillHeight] = useState<
    ReturnType<typeof getFillHeightExpression>
  >(initedFillHeight)

  const refreshFillHeight = useCallback(
    () => setFillHeight(getFillHeightExpression()),
    []
  )

  usePageEvent('onResize', refreshFillHeight)
  usePageEvent('onShow', refreshFillHeight)
  useEffect(() => {
    refreshFillHeight()
  }, [refreshFillHeight])

  return fillHeight
}
