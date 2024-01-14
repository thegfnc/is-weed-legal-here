import Image from 'next/image'
import { useState } from 'react'
import { MdOutlineMyLocation } from 'react-icons/md'

import geocoding from '@/app//data/geocoding'
import { useRouter } from 'next/navigation'
import getCurrentLocationFromGeocoderResponse from '@/app//helpers/getCurrentLocationFromGeocoderResponse'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '@/app/helpers/getUrlFromCurrentLocation'

enum LoadingState {
  SEARCHING_FOR_DATA = "Just a moment while we hit up Google Maps like we're at the bottom of the bag.",
}

enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Geocoding library could not be loaded.',
  BAD_LAT_LONG = 'Could not interpret your location based on provided lattitude and longitude coordinates.',
}

export default function IPGeolocation() {
  const router = useRouter()
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const handleIPGeolocation = async () => {
    setLoadingState(LoadingState.SEARCHING_FOR_DATA)

    const response = await fetch('/api/location')
    const location = await response.json()
    const geocoder = await geocoding

    if (!geocoder) {
      throw new Error(ErrorMessages.LIBRARY_NOT_LOADED)
    }

    new geocoder.Geocoder()
      .geocode({
        language: 'en',
        location: {
          lat: Number(location.latitude),
          lng: Number(location.longitude),
        },
      })
      .then((response: google.maps.GeocoderResponse) => {
        const currentLocation = getCurrentLocationFromGeocoderResponse(response)

        if (currentLocation.country === DASH_PLACEHOLDER) {
          throw new Error(ErrorMessages.BAD_LAT_LONG)
        }

        const url = getUrlFromCurrentLocation(currentLocation, '/result')
        router.push(url)
      })
      .catch(error => {
        setLoadingState(null)
        setError(error)
      })
  }

  return (
    <>
      <div
        className={`mt-14 flex max-w-md flex-col items-center rounded-lg bg-black/5 p-6 text-[12px] leading-4 transition-opacity`}
      >
        {error ? (
          <div className='text-red-500'>{error.message}</div>
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
