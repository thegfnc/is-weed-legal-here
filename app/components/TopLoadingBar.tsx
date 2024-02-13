'use client'

import {
  CSSProperties,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function useInterval(callback: () => void, delay: number | null | false) {
  const savedCallback = useRef(() => {})

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (delay === null || delay === false) return undefined
    const tick = () => savedCallback.current()
    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}

function randomValue(min: number, max: number): number {
  return Math.random() * (max - min + 1) + min
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomValue(min, max))
}

type LoadingBarRef = {
  continuousStart: (startingValue?: number) => void
  complete: () => void
}

const LoadingBar = forwardRef<LoadingBarRef>(function LoadingBarInner({}, ref) {
  const color = '#231746'
  const transitionTime = 300
  const loaderSpeed = 500
  const refreshRate = 1000
  const waitingTime = 1000

  const isMounted = useRef(false)
  const [localProgress, localProgressSet] = useState<number>(0)

  const pressedContinuous = useRef<{
    active: boolean
  }>({ active: false })

  const initialLoaderStyle: CSSProperties = {
    height: '100%',
    background: color,
    transition: `all ${loaderSpeed}ms ease`,
    width: '0%',
  }

  const [loaderStyle, loaderStyleSet] =
    useState<CSSProperties>(initialLoaderStyle)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useImperativeHandle(ref, () => ({
    continuousStart(startingValue?: number) {
      const val = startingValue || randomInt(10, 20)

      pressedContinuous.current = {
        active: true,
      }

      localProgressSet(val)
      checkIfFull(val)
    },
    complete() {
      localProgressSet(100)
      checkIfFull(100)
    },
  }))

  useEffect(() => {
    loaderStyleSet({
      ...loaderStyle,
      background: color,
    })
  }, [color]) // eslint-disable-line

  useEffect(() => {
    if (ref) {
      checkIfFull(localProgress)
    }
  }, []) // eslint-disable-line

  const checkIfFull = (_progress: number) => {
    if (_progress >= 100) {
      // now it should wait a little
      loaderStyleSet({
        ...loaderStyle,
        width: '100%',
      })

      setTimeout(() => {
        if (!isMounted.current) {
          return
        }
        // now it can fade out
        loaderStyleSet({
          ...loaderStyle,
          opacity: 0,
          transform: 'translateY(-8px)',
          width: '100%',
          transition: `all ${transitionTime}ms ease-out`,
          color: color,
        })

        setTimeout(() => {
          if (!isMounted.current) {
            return
          }
          // here we wait for it to fade
          if (pressedContinuous.current.active) {
            // if we have continuous loader just ending, we kill it and reset it

            pressedContinuous.current = {
              ...pressedContinuous.current,
              active: false,
            }

            localProgressSet(0)
            checkIfFull(0)
          }

          localProgressSet(0)
          checkIfFull(0)
        }, transitionTime)
      }, waitingTime)
    } else {
      loaderStyleSet(_loaderStyle => {
        return {
          ..._loaderStyle,
          width: _progress + '%',
          opacity: 1,
          transform: 'translateY(0)',
          transition: _progress > 0 ? `all ${loaderSpeed}ms ease` : '',
        }
      })
    }
  }

  useInterval(
    () => {
      const minValue = Math.min(10, (100 - localProgress) / 5)
      const maxValue = Math.min(20, (100 - localProgress) / 3)

      const random = randomValue(minValue, maxValue)

      if (localProgress + random < 95) {
        localProgressSet(localProgress + random)
        checkIfFull(localProgress + random)
      }
    },
    pressedContinuous.current.active ? refreshRate : null
  )

  return (
    <div className='fixed left-0 top-0 z-10 h-1 w-full bg-transparent'>
      <div style={{ ...loaderStyle }}></div>
    </div>
  )
})

export default function TopLoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const ref = useRef<LoadingBarRef>(null)

  useEffect(() => {
    const currentRef = ref.current

    currentRef?.complete()

    return () => {
      currentRef?.continuousStart()
    }
  }, [pathname, searchParams])

  return <LoadingBar ref={ref} />
}
