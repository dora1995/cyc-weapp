import React, { FC } from 'react'

import './app.css'
import { AppState } from '@/state'
const App: FC = (props) => (
  <AppState.Provider>{props.children}</AppState.Provider>
)

export default App
