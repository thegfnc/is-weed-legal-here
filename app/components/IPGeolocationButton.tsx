import Image from 'next/image'
import { useState } from 'react'
import { MdOutlineMyLocation } from 'react-icons/md'

import { geocoding } from '@/app/data/maps'
import { useRouter } from 'next/navigation'
import getCurrentLocationFromGeocoderResponse from '@/app//helpers/getCurrentLocationFromGeocoderResponse'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '@/app/helpers/getUrlFromCurrentLocation'
import LoadingStates from '../data/loadingStates'
import ErrorMessages from '../data/errorMessages'

export default function IPGeolocationButton() {
  const router = useRouter()
  const [loadingState, setLoadingState] = useState<LoadingStates | null>(null)
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null)

  const handleIPGeolocation = async () => {
    setLoadingState(LoadingStates.SEARCHING_FOR_DATA)

    const locationResponse = await fetch('/api/location')
    const location = await locationResponse.json()
    const geocoder = await geocoding

    if (!geocoder) {
      setErrorMessage(ErrorMessages.LIBRARY_NOT_LOADED)
      return
    }

    try {
      const geocodeResponse = await new geocoder.Geocoder().geocode({
        language: 'en',
        location: {
          lat: Number(location.latitude),
          lng: Number(location.longitude),
        },
      })

      const currentLocation =
        getCurrentLocationFromGeocoderResponse(geocodeResponse)

      if (currentLocation.country === DASH_PLACEHOLDER) {
        setErrorMessage(ErrorMessages.BAD_LAT_LONG)
        return
      }

      const url = getUrlFromCurrentLocation(currentLocation, '/result')
      router.push(url)
    } catch {
      setLoadingState(null)
      setErrorMessage(ErrorMessages.UNKNOWN)
    }
  }

  return (
    <>
      <div className='mt-14 flex max-w-md flex-col items-center rounded-lg bg-black/5 p-6 text-[12px] leading-4 transition-opacity'>
        {errorMessage ? (
          <div className='text-red-500'>{errorMessage}</div>
        ) : (
          <div>
            {loadingState ||
              "If you don't feel comfortable sharing your browser's location, we can estimate your location using your IP address."}
          </div>
        )}
        {loadingState ? (
          <Image
            src='/loading-spinner-dark.svg'
            width='32'
            height='32'
            alt='Loading spinner'
            className='mt-4'
          />
        ) : (
          <button
            onClick={handleIPGeolocation}
            className='mt-4 flex items-center rounded-full bg-brand-purple px-4 py-2 text-brand-yellow transition-opacity hover:opacity-90 active:opacity-100'
          >
            <MdOutlineMyLocation className='mr-2' />
            Estimate my location
          </button>
        )}
      </div>
    </>
  )
}
