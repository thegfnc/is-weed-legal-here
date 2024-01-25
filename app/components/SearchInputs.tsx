'use client'

import { useContext, useEffect, useState } from 'react'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import BrowserLocationButton from './BrowserLocationButton'
import LoadingStates from '../data/loadingStates'
import ErrorMessages from '../data/errorMessages'
import IPGeolocationButton from './IPGeolocationButton'
import PlacesAutocompleteInput from './PlacesAutocompleteInput'
import LoadingSpinner from './LoadingSpinner'

export default function Home() {
  const setBackgroundColor = useContext(SetBackgroundColorContext)
  const [loadingState, setLoadingState] = useState<LoadingStates | null>(null)
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null)

  const handleSetLoadingState = (loadingState: LoadingStates | null) => {
    setErrorMessage(null)
    setLoadingState(loadingState)
  }

  const handleSetErrorMessage = (errorMessage: ErrorMessages | null) => {
    setLoadingState(null)
    setErrorMessage(errorMessage)
  }

  useEffect(() => {
    setBackgroundColor(BackgroundColor.YELLOW)
  }, [setBackgroundColor])

  return (
    <>
      {errorMessage && (
        <div className='leading-6 text-red-500'>{errorMessage}</div>
      )}

      {loadingState ? (
        <div className='mx-auto flex max-w-xl flex-col items-center gap-8 text-balance text-[18px]'>
          <div>{loadingState && <LoadingSpinner />}</div>
          <div className='min-h-[48px] leading-6'>{loadingState}</div>
        </div>
      ) : (
        <>
          <PlacesAutocompleteInput
            setLoadingState={handleSetLoadingState}
            setErrorMessage={handleSetErrorMessage}
          />
          <BrowserLocationButton
            setLoadingState={handleSetLoadingState}
            setErrorMessage={handleSetErrorMessage}
          />
        </>
      )}

      {errorMessage === ErrorMessages.PERMISSION_DENIED && (
        <IPGeolocationButton
          setLoadingState={handleSetLoadingState}
          setErrorMessage={handleSetErrorMessage}
        />
      )}
    </>
  )
}
