import Image from 'next/image'
import { useState } from 'react'
import { geocoding } from '@/app/data/maps'
import IPGeolocation from './IPGeolocation'
import { useRouter } from 'next/navigation'
import getCurrentLocationFromGeocoderResponse from '@/app/helpers/getCurrentLocationFromGeocoderResponse'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '@/app/helpers/getUrlFromCurrentLocation'
import { MdOutlineLocationOn } from 'react-icons/md'

enum LoadingState {
  ASKING_FOR_PERMISSION = "Don't hold out on us. Allow your location to find out if you can legally light one up!",
  RETRIEVING_LOCATION = "We're just waiting on the browser to pass us your location.",
  SEARCHING_FOR_DATA = "Just a moment while we hit up Google Maps like we're at the bottom of the bag.",
}

enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Geocoding library could not be loaded.',
  PERMISSION_DENIED = 'Allow location access to see if you can legally light one up!',
  POSITION_UNAVAILABLE = "Bummer! The browser won't share your current location.",
  TIMEOUT = 'Did you space out? Allow location access to see if you can legally light one up!',
  UNKNOWN = "An unknown error occurred. That's not very chill. Try hitting that refresh button.",
  BAD_LAT_LONG = 'Could not interpret your location based on provided lattitude and longitude coordinates.',
}

export default function BrowserLocationButton() {
  const router = useRouter()
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const handleGeocode = () => {
    globalThis.navigator.geolocation.getCurrentPosition(
      position => {
        setLoadingState(LoadingState.SEARCHING_FOR_DATA)

        geocoding.then(async geocodingLib => {
          if (!geocodingLib) {
            throw new Error(ErrorMessages.LIBRARY_NOT_LOADED)
          }

          new geocodingLib.Geocoder()
            .geocode({
              language: 'en',
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            })
            .then((response: google.maps.GeocoderResponse) => {
              const currentLocation =
                getCurrentLocationFromGeocoderResponse(response)

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

  return (
    <div className='mb-6 flex max-w-xl flex-col items-center text-balance text-[18px]'>
      {loadingState ? (
        <>
          <div className='mt-10'>
            {loadingState && (
              <Image
                src='/loading-spinner-dark.svg'
                width='42'
                height='42'
                alt='Loading spinner'
              />
            )}
          </div>
          <div className='mt-10 min-h-[48px] leading-6'>{loadingState}</div>
        </>
      ) : (
        <button
          onClick={geolocationPermissionListener}
          className='flex items-center px-4 py-2 text-lg underline-offset-4 hover:underline'
        >
          <MdOutlineLocationOn size='28px' className='mr-1' />
          Use current location
        </button>
      )}
      {!loadingState && error && (
        <>
          <div className='leading-6 text-red-500'>{error.message}</div>
          <IPGeolocation />
        </>
      )}
    </div>
  )
}
