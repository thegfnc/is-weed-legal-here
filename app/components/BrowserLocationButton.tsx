import Image from 'next/image'
import { useState } from 'react'
import { geocoding } from '@/app/data/maps'
import IPGeolocation from './IPGeolocationButton'
import { useRouter } from 'next/navigation'
import getCurrentLocationFromGeocoderResponse from '@/app/helpers/getCurrentLocationFromGeocoderResponse'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '@/app/helpers/getUrlFromCurrentLocation'
import { MdOutlineLocationOn } from 'react-icons/md'
import LoadingStates from '../data/loadingStates'
import ErrorMessages from '../data/errorMessages'

export default function BrowserLocationButton() {
  const router = useRouter()
  const [loadingState, setLoadingState] = useState<LoadingStates | null>(null)
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | null>(null)

  const handleGeocode = () => {
    globalThis.navigator.geolocation.getCurrentPosition(
      async position => {
        setLoadingState(LoadingStates.SEARCHING_FOR_DATA)

        const geocodingLib = await geocoding

        if (!geocodingLib) {
          setErrorMessage(ErrorMessages.LIBRARY_NOT_LOADED)
          return
        }

        try {
          const geocodeResponse = await new geocodingLib.Geocoder().geocode({
            language: 'en',
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
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
      },
      error => {
        setLoadingState(null)

        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage(ErrorMessages.PERMISSION_DENIED)
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setErrorMessage(ErrorMessages.POSITION_UNAVAILABLE)
        } else if (error.code === error.TIMEOUT) {
          setErrorMessage(ErrorMessages.TIMEOUT)
        } else {
          setErrorMessage(ErrorMessages.UNKNOWN)
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 20000, // 20 seconds
        maximumAge: 30000, // 30 seconds
      }
    )
  }

  const geolocationPermissionListener = async () => {
    setLoadingState(LoadingStates.ASKING_FOR_PERMISSION)
    const permissionStatus = await navigator.permissions.query({
      name: 'geolocation',
    })

    if (permissionStatus.state === 'denied') {
      setLoadingState(null)
      setErrorMessage(ErrorMessages.PERMISSION_DENIED)
      return
    }

    if (permissionStatus.state === 'granted') {
      handleGeocode()
      setLoadingState(LoadingStates.RETRIEVING_LOCATION)
    }

    if (permissionStatus.state === 'prompt') {
      handleGeocode()

      const handleChange = () => {
        if (permissionStatus.state === 'granted') {
          setLoadingState(LoadingStates.RETRIEVING_LOCATION)
        }

        permissionStatus.removeEventListener('change', handleChange)
      }

      permissionStatus.addEventListener('change', handleChange)
    }
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
      {!loadingState && errorMessage && (
        <>
          <div className='leading-6 text-red-500'>{errorMessage}</div>
          <IPGeolocation />
        </>
      )}
    </div>
  )
}
