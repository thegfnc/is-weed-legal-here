import { useEffect } from 'react'

interface Listener {
  addEventListener(
    name: string,
    handler: (event?: any) => void,
    ...args: any[]
  ): void

  removeEventListener(
    name: string,
    handler: (event?: any) => void,
    ...args: any[]
  ): void
}

export type UseEventTarget = Listener

const isBrowser = typeof window !== 'undefined'
const defaultTarget = isBrowser ? window : null

const isListener = (target: any): target is Listener => {
  return !!target.addEventListener
}

type AddEventListener<T> = T extends Listener ? T['addEventListener'] : never

export type UseEventOptions<T> = Parameters<AddEventListener<T>>[2]

const useEvent = <T extends UseEventTarget>(
  name: Parameters<AddEventListener<T>>[0],
  handler?: null | undefined | Parameters<AddEventListener<T>>[1],
  target: null | T | Window = defaultTarget,
  options?: UseEventOptions<T>
) => {
  useEffect(() => {
    if (!handler) {
      return
    }
    if (!target) {
      return
    }
    if (isListener(target)) {
      if (target && target.addEventListener) {
        target.addEventListener(name, handler, options)
      }
    }
    return () => {
      if (isListener(target)) {
        if (target && target.removeEventListener) {
          target.removeEventListener(name, handler, options)
        }
      }
    }
  }, [name, handler, target, JSON.stringify(options)])
}

export default useEvent
