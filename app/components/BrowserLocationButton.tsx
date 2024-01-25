import { getGeocodingClient } from '@/app/data/mapsClient'
import { useRouter } from 'next/navigation'
import getCurrentLocationFromGeocoderResponse from '@/app/helpers/getCurrentLocationFromGeocoderResponse'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '@/app/helpers/getUrlFromCurrentLocation'
import { MdOutlineLocationOn } from 'react-icons/md'
import LoadingStates from '../data/loadingStates'
import ErrorMessages from '../data/errorMessages'

type BrowserLocationButtonProps = {
  setLoadingState: (loadingState: LoadingStates | null) => void
  setErrorMessage: (errorMessage: ErrorMessages | null) => void
}

export default function BrowserLocationButton({
  setLoadingState,
  setErrorMessage,
}: BrowserLocationButtonProps) {
  const router = useRouter()

  const handleGeocode = () => {
    globalThis.navigator.geolocation.getCurrentPosition(
      async position => {
        setLoadingState(LoadingStates.SEARCHING_FOR_DATA)

        const geocodingLib = await getGeocodingClient()

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
          setErrorMessage(ErrorMessages.UNKNOWN)
        }
      },
      error => {
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
    <div className='flex flex-col items-center justify-center text-balance text-[18px]'>
      <button
        onClick={geolocationPermissionListener}
        className='flex items-center px-4 py-2 text-lg underline-offset-4 hover:underline'
      >
        <MdOutlineLocationOn size='28px' className='mr-1' />
        Use current location
      </button>
    </div>
  )
}
