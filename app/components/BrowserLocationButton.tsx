'use client'

import { Loader } from '@googlemaps/js-api-loader'
import Image from 'next/image'
import { useState } from 'react'
import { CurrentLocation } from '../types/CurrentLocation'

const loader = new Loader({
  apiKey: 'AIzaSyAtFp26-bVYD6DfUZwl_FvhGh0XhScKEI0',
  version: 'weekly',
})

const geocoding = globalThis.navigator
  ? loader.importLibrary('geocoding')
  : Promise.resolve(null)

type BrowserLocationButtonProps = {
  setCurrentLocation: (state: CurrentLocation) => void
}

enum LoadingState {
  ASKING_FOR_PERMISSION = "Don't hold out on us. Allow your location to find out if you can legally light one up!",
  RETRIEVING_LOCATION = "We're just waiting on your browser to pass us your location.",
  SEARCHING_FOR_DATA = "Just a moment while we hit up Google Maps like we're at the bottom of the bag.",
  SUCCESS = 'Success',
}

enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Geocoding library could not be loaded.',
  PERMISSION_DENIED = 'Allow location access to see if you can legally light one up!',
  POSITION_UNAVAILABLE = "Bummer! The browser won't share your current location.",
  TIMEOUT = 'Did you space out? Allow location access to see if you can legally light one up!',
  UNKNOWN = "An unknown error occurred. That's not very chill. Try hitting that refresh button.",
  BAD_LAT_LONG = 'Could not interpret your location based on provided lattitude and longitude coordinates.',
}

export default function BrowserLocationButton({
  setCurrentLocation,
}: BrowserLocationButtonProps) {
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null)
  const [error, setError] = useState<Error | null>(null)

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
              language: 'en',
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            })
            .then((response: google.maps.GeocoderResponse) => {
              const countryResult = response.results.find(result =>
                result.types.includes('country')
              )

              // US states are administrative_area_level_1
              const administrativeAreaLevel1Result = response.results.find(
                result => result.types.includes('administrative_area_level_1')
              )

              // US counties are administrative_area_level_2
              const administrativeAreaLevel2Result = response.results.find(
                result => result.types.includes('administrative_area_level_2')
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
                  administrativeAreaLevel1Result?.address_components[0]
                    .long_name,
                administrativeAreaLevel2:
                  administrativeAreaLevel2Result?.address_components[0]
                    .long_name,
                locality: localityResult?.address_components[0].long_name,
                postalCode: postalCodeResult?.address_components[0].long_name,
              })
            })
            .catch(error => setError(error))
            .finally(() => setLoadingState(LoadingState.SUCCESS))
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

  if (loadingState === LoadingState.SUCCESS) {
    return null
  }

  return (
    <div className='mb-6 flex max-w-xl flex-col items-center text-[14px]'>
      {loadingState ? (
        <>
          <div className='mt-6 min-h-[14px] text-[14px] leading-6'>
            {loadingState}
          </div>
          <div className='mt-4'>
            {loadingState && (
              <Image
                src='/loading-spinner.svg'
                width='36'
                height='36'
                alt='Loading spinner'
              />
            )}
          </div>
        </>
      ) : (
        <div>
          This location has been estimated based on your IP address. If it is
          incorrect or you want something more precise,{' '}
          <a
            href='#'
            onClick={geolocationPermissionListener}
            className='hover:underline'
          >
            click here
          </a>{' '}
          to use your browser location.
        </div>
      )}
      {error && (
        <p className='mt-6 text-[14px] leading-4 text-red-500'>
          {error.message}
        </p>
      )}
    </div>
  )
}
