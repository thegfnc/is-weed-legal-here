'use client'

import { useContext, useEffect } from 'react'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import PlacesSearchInput from './PlacesSearchInput'
import BrowserLocationButton from './BrowserLocationButton'

export default function Home() {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  useEffect(() => {
    setBackgroundColor(BackgroundColor.YELLOW)
  }, [setBackgroundColor])

  return (
    <>
      <div className='mt-8 flex justify-center'>
        <PlacesSearchInput />
      </div>
      <div className='mt-6 flex justify-center'>
        <BrowserLocationButton />
      </div>
    </>
  )
}
