import { useEffect } from 'react'
import { createContainer } from 'unstated-next'

import useFrom from './from'
import useToken from './token'
import useModules from './modules'

type StateType = ReturnType<typeof useAppStateInner>
type LatestStateType = null | StateType
let latestState: LatestStateType = null

type EffectReturnType = ReturnType<Parameters<typeof useEffect>[0]>
type GetDeps = <T extends unknown[]>(state: StateType) => T
type WatchCallback = <T extends unknown[]>(...args: T) => EffectReturnType

type WatchChangeStack = [GetDeps, WatchCallback]
let WATCH_CHANGE_STACK: WatchChangeStack[] = []

export function watchChange<T extends any[]>(
  getDeps: (state: StateType) => T,
  watchCallback: (...args: T) => EffectReturnType
) {
  WATCH_CHANGE_STACK.push([getDeps as GetDeps, watchCallback as WatchCallback])
}

export const AppState = createContainer(useAppStateInner)
export const useAppState = () => AppState.useContainer()
function useAppStateInner() {
  WATCH_CHANGE_STACK = []

  const rootState = {
    ...useModules(),
    ...useToken(),
    ...useFrom(),
  }

  latestState = rootState

  WATCH_CHANGE_STACK.forEach(([getDeps, watchCallback]) => {
    const deps = getDeps(rootState)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      return watchCallback(...deps)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
  })

  return rootState
}

export const getState = () => {
  if (!latestState) {
    throw new Error('state is not init')
  }
  return latestState
}
