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
}

enum LoadingState {}

export default function FindOutButton({ setCurrentState }: FindOutButtonProps) {
  const [loadingState, setLoadingState] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const handleGeocode = () => {
    globalThis.navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoadingState('Searching for data about your location...')

        geocoding.then(async (geocoder) => {
          if (!geocoder) {
            throw new Error('Geocoding library not loaded.')
          }

          new geocoder.Geocoder()
            .geocode({
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            })
            .then((response: google.maps.GeocoderResponse) => {
              const stateResult = response.results.find((result) => {
                return result.types.find((type) => {
                  return type === 'administrative_area_level_1'
                })
              })

              if (!stateResult) {
                throw new Error(
                  'Could not detect your state based on lat/long coordinates.'
                )
              }

              setCurrentState(stateResult.address_components[0].long_name)
            })
            .catch((e) => setError(e))
            .finally(() => setLoadingState(null))
        })
      },
      (error) => {
        setLoadingState(null)

        if (error.code === error.PERMISSION_DENIED) {
          setError(
            new Error('You must allow location access to use this feature.')
          )
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setError(new Error('Your location is unavailable.'))
        } else if (error.code === error.TIMEOUT) {
          setError(new Error('Your location request timed out.'))
        } else {
          setError(new Error('An unknown error occurred.'))
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 10000, // 10 seconds
        maximumAge: 30000, // 30 seconds
      }
    )
  }

  const geolocationPermissionListener = () => {
    setLoadingState('Asking for permission to see your location...')
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        if (permissionStatus.state === 'denied') {
          setLoadingState(null)
          setError(
            new Error('You must allow location access to use this feature.')
          )
          return
        }

        if (permissionStatus.state === 'granted') {
          handleGeocode()
          setLoadingState('Retrieving location from browser...')
        }

        if (permissionStatus.state === 'prompt') {
          handleGeocode()

          const handleChange = () => {
            if (permissionStatus.state === 'granted') {
              setLoadingState('Retrieving location from browser...')
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
        onClick={handleGeocode}
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
      {
        <p className='mt-10 min-h-[16px] text-[16px] leading-4'>
          {loadingState}
        </p>
      }
      {error && (
        <p className='mt-10 text-[16px] text-red-500 md:text-[20px]'>
          {error.message}
        </p>
      )}
    </>
  )
}
