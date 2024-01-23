'use client'

import { useContext, useEffect, useState } from 'react'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import PlacesSearchInput from './PlacesSearchInput'
import BrowserLocationButton from './BrowserLocationButton'
import LoadingStates from '../data/loadingStates'
import ErrorMessages from '../data/errorMessages'

export default function Home() {
  const setBackgroundColor = useContext(SetBackgroundColorContext)
  const [loadingState, setLoadingState] = useState<LoadingStates | null>(null)
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null)

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
