'use client'

import { Loader } from '@googlemaps/js-api-loader'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CurrentLocation } from '../types/CurrentLocation'

const loader = new Loader({
  apiKey: 'AIzaSyAtFp26-bVYD6DfUZwl_FvhGh0XhScKEI0',
  version: 'weekly',
})

const geocoding = globalThis.navigator
  ? loader.importLibrary('geocoding')
  : Promise.resolve(null)

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

  useEffect(() => {
    handleIPGeolocation()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div
        className={`mt-10 flex justify-center rounded-lg text-[24px] transition-opacity`}
      >
        <Image
          src='/loading-spinner.svg'
          width='36'
          height='36'
          alt='Loading spinner'
        />
      </div>
      {error ? (
        <p className='mt-10 text-[16px] leading-4 text-red-500'>
          {error.message}
        </p>
      ) : (
        <p className='mt-10 min-h-[16px] text-[16px] leading-6'>
          {loadingState}
        </p>
      )}
    </>
  )
}
