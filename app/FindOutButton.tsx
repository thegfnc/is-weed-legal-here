'use client'

import { Loader } from '@googlemaps/js-api-loader'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const loader = new Loader({
  apiKey: 'AIzaSyAtFp26-bVYD6DfUZwl_FvhGh0XhScKEI0',
  version: 'weekly',
})

const geocoding = globalThis.navigator
  ? loader.importLibrary('geocoding')
  : Promise.resolve(null)

type FindOutButtonProps = {
  setCurrentState: (state: string) => void
  setGoogleMapsLink: (state: string) => void
}

enum LoadingState {
  ASKING_FOR_PERMISSION = 'Asking for permission to see your location...',
  RETRIEVING_LOCATION = 'Retrieving your location from the browser...',
  SEARCHING_FOR_DATA = 'Searching for data about your location...',
}

enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Geocoding library could not be loaded.',
  PERMISSION_DENIED = 'You must allow location access to use this feature.',
  POSITION_UNAVAILABLE = 'Your location is unavailable.',
  TIMEOUT = 'Your location request timed out.',
  UNKNOWN = 'An unknown error occurred.',
  BAD_LAT_LONG = 'Could not interpret your location based on provided lattitude and longitude coordinates.',
}

export default function FindOutButton({
  setCurrentState,
  setGoogleMapsLink,
}: FindOutButtonProps) {
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const reloadPage = () => {
    globalThis.location.reload()
  }

  const handleGeocode = () => {
    globalThis.navigator.geolocation.getCurrentPosition(
      position => {
        setLoadingState(LoadingState.SEARCHING_FOR_DATA)

        geocoding.then(async geocoder => {
          if (!geocoder) {
            throw new Error(ErrorMessages.LIBRARY_NOT_LOADED)
          }

          new geocoder.Geocoder()
            .geocode({
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            })
            .then((response: google.maps.GeocoderResponse) => {
              const stateResult = response.results.find(result =>
                result.types.includes('administrative_area_level_1')
              )

              const postalCodeResult = response.results.find(result =>
                result.types.includes('postal_code')
              )

              if (!stateResult || !postalCodeResult) {
                throw new Error(ErrorMessages.BAD_LAT_LONG)
              }

              setCurrentState(stateResult.address_components[0].long_name)
              setGoogleMapsLink(
                `https://www.google.com/maps/search/?api=1&query=dispensary+near+${postalCodeResult.address_components[0].long_name}`
              )
            })
            .catch(error => setError(error))
            .finally(() => setLoadingState(null))
        })
      },
      error => {
        setLoadingState(null)

        if (error.code === error.PERMISSION_DENIED) {
          setError(new Error(ErrorMessages.PERMISSION_DENIED))
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setError(new Error(ErrorMessages.POSITION_UNAVAILABLE))
        } else if (error.code === error.TIMEOUT) {
          setError(new Error(ErrorMessages.TIMEOUT))
        } else {
          setError(new Error(ErrorMessages.UNKNOWN))
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 20000, // 20 seconds
        maximumAge: 30000, // 30 seconds
      }
    )
  }

  const geolocationPermissionListener = () => {
    setLoadingState(LoadingState.ASKING_FOR_PERMISSION)
    navigator.permissions
      .query({ name: 'geolocation' })
      .then(permissionStatus => {
        if (permissionStatus.state === 'denied') {
          setLoadingState(null)
          setError(new Error(ErrorMessages.PERMISSION_DENIED))
          return
        }

        if (permissionStatus.state === 'granted') {
          handleGeocode()
          setLoadingState(LoadingState.RETRIEVING_LOCATION)
        }

        if (permissionStatus.state === 'prompt') {
          handleGeocode()

          const handleChange = () => {
            if (permissionStatus.state === 'granted') {
              setLoadingState(LoadingState.RETRIEVING_LOCATION)
            }

            permissionStatus.removeEventListener('change', handleChange)
          }

          permissionStatus.addEventListener('change', handleChange)
        }
      })
  }

  useEffect(() => {
    if (
      globalThis.navigator?.permissions &&
      globalThis.navigator?.geolocation
    ) {
      geolocationPermissionListener()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <button
        className='mt-10 flex w-40 justify-center rounded-lg bg-brand-purple p-6 text-[24px] text-brand-yellow hover:bg-brand-purple'
        onClick={reloadPage}
      >
        {loadingState ? (
          <Image
            src='/loading-spinner.svg'
            width='36'
            height='36'
            alt='Loading spinner'
          />
        ) : (
          'Find out'
        )}
      </button>
      {error ? (
        <p className='mt-10 text-[16px] leading-4 text-red-500'>
          {error.message}
        </p>
      ) : (
        <p className='mt-10 min-h-[16px] text-[16px] leading-4'>
          {loadingState}
        </p>
      )}
    </>
  )
}
