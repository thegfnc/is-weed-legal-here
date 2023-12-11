'use client'

import Image from 'next/image'
import { useState } from 'react'
import { MdOutlineMyLocation } from 'react-icons/md'

import { CurrentLocation } from '../data/types'
import geocoding from '../data/geocoding'

type IPGeolocationProps = {
  setCurrentLocation: (state: CurrentLocation) => void
}

enum LoadingState {
  SEARCHING_FOR_DATA = "Just a moment while we hit up Google Maps like we're at the bottom of the bag.",
}

enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Geocoding library could not be loaded.',
  BAD_LAT_LONG = 'Could not interpret your location based on provided lattitude and longitude coordinates.',
}

export default function IPGeolocation({
  setCurrentLocation,
}: IPGeolocationProps) {
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
        const countryResult = response.results.find(result =>
          result.types.includes('country')
        )

        // US states are administrative_area_level_1
        const administrativeAreaLevel1Result = response.results.find(result =>
          result.types.includes('administrative_area_level_1')
        )

        // US counties are administrative_area_level_2
        const administrativeAreaLevel2Result = response.results.find(result =>
          result.types.includes('administrative_area_level_2')
        )

        // US cities are locality
        const localityResult = response.results.find(result =>
          result.types.includes('locality')
        )

        const postalCodeResult = response.results.find(result =>
          result.types.includes('postal_code')
        )

        if (!countryResult) {
          throw new Error(ErrorMessages.BAD_LAT_LONG)
        }

        setCurrentLocation({
          country: countryResult?.address_components[0].long_name,
          administrativeAreaLevel1:
            administrativeAreaLevel1Result?.address_components[0].long_name,
          administrativeAreaLevel2:
            administrativeAreaLevel2Result?.address_components[0].long_name,
          locality: localityResult?.address_components[0].long_name,
          postalCode: postalCodeResult?.address_components[0].long_name,
        })
      })
      .catch(error => setError(error))
      .finally(() => setLoadingState(null))
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
