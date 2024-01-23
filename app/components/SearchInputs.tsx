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
import Image from 'next/image'
import IPGeolocationButton from './IPGeolocationButton'

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
          <div>
            {loadingState && (
              <Image
                src='/loading-spinner-dark.svg'
                width='42'
                height='42'
                alt='Loading spinner'
              />
            )}
          </div>
          <div className='min-h-[48px] leading-6'>{loadingState}</div>
        </div>
      ) : (
        <>
          <div className=' flex justify-center'>
            <PlacesSearchInput
              setLoadingState={handleSetLoadingState}
              setErrorMessage={handleSetErrorMessage}
            />
          </div>
          <div className=' flex justify-center'>
            <BrowserLocationButton
              setLoadingState={handleSetLoadingState}
              setErrorMessage={handleSetErrorMessage}
            />
          </div>
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
