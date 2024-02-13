import { useEffect, useRef, useState } from 'react'

export default function useFadeIn() {
  const opactiyTimeoutId = useRef<ReturnType<typeof setTimeout>>()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    opactiyTimeoutId.current = setTimeout(() => {
      setOpacity(100)
    }, 1)

    return () => {
      setOpacity(0)
      clearTimeout(opactiyTimeoutId.current)
    }
  }, [])

  return `transition-opacity duration-500 delay-100 opacity-${opacity}`
}
