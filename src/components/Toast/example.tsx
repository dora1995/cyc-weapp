import React, { useState } from 'react'
import { Button } from 'remax/one'
import Toast from '.'

export default () => {
  const [showToast, setShowToast] = useState(false)

  return (
    <>
      <Button onTap={() => setShowToast(true)}>打开Toast</Button>
      <Toast
        show={showToast}
        title="toast吧"
        onTapBackground={() => setShowToast(false)}
      ></Toast>
    </>
  )
}
