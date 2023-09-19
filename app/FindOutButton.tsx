'use client'

import { Loader } from "@googlemaps/js-api-loader"
import Image from "next/image";
import { useEffect, useState } from "react";

const loader = new Loader({
  apiKey: "AIzaSyAtFp26-bVYD6DfUZwl_FvhGh0XhScKEI0",
  version: "weekly",
});

const geocoding = globalThis.navigator ? loader.importLibrary("geocoding") : Promise.resolve(null);

type FindOutButtonProps = {
  setCurrentState: (state: string) => void
}

export default function FindOutButton({ setCurrentState }: FindOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleGeocode = () => {
    setIsLoading(true)

    globalThis.navigator.geolocation.getCurrentPosition((position) => {
      geocoding.then(async (geocoder) => {
        if (!geocoder) { throw new Error('Geocoding library not loaded.') }

        new geocoder.Geocoder()
          .geocode({ location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }})
          .then((response: google.maps.GeocoderResponse) => {
            const stateResult = response.results.find((result) => {
              return result.types.find((type) => {
                return type === 'administrative_area_level_1'
              })
            })

            if (!stateResult) {
              throw new Error('Could not detect your state based on lat/long coordinates.')
            }

            setCurrentState(stateResult.address_components[0].long_name)
          })
          .catch((e) => setError(e))
          .finally(() => setIsLoading(false))
      });
    },  (error) => {
      setIsLoading(false)

      if (error.code === error.PERMISSION_DENIED) {
        setError(new Error('You must allow location access to use this feature.'))
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        setError(new Error('Your location is unavailable.'))
      } else if (error.code === error.TIMEOUT) {
        setError(new Error('Your location request timed out.'))
      } else {
        setError(new Error('An unknown error occurred.'))
      }
    }, {
      enableHighAccuracy: false,
      timeout: 10000, // 10 seconds
      maximumAge: 30000 // 30 seconds
    })
  }

  useEffect(() => {
    if (globalThis.navigator?.geolocation) {
      handleGeocode()
    }
  }, [])

  return (
    <>
      <button
        className="p-6 mt-10 text-brand-yellow bg-brand-purple rounded-lg text-[24px] hover:bg-brand-purple w-40 flex justify-center"
        onClick={handleGeocode}
      >
        {isLoading ? <Image src="/loading-spinner.svg" width="36" height="36" alt="Loading spinner" /> : "Find out"}
      </button>
      {error && <p className="text-[16px] md:text-[20px] text-red-500 mt-10">{error.message}</p>}
    </>
  )
}
