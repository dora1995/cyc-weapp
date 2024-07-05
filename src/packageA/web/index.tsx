import React, { useState } from 'react'
import { useQuery } from 'remax'
import { WebView } from 'remax/one'

export default () => {
  const { url } = useQuery()
  const [inputUrl] = useState(decodeURIComponent(`${url}`))

  return <WebView src={inputUrl} />
}
