'use client'

import { Loader } from "@googlemaps/js-api-loader"
import Image from "next/image";
import { useState } from "react";

const loader = new Loader({
  apiKey: "AIzaSyAtFp26-bVYD6DfUZwl_FvhGh0XhScKEI0",
  version: "weekly",
});

export default function FindOutButton({setCurrentState}) {
  const [isLoading, setIsLoading] = useState(false)

  if (!globalThis.navigator?.geolocation) {
    console.log('geolocation is not available')
  }

  const handleClick = () => {
    setIsLoading(true)

    globalThis.navigator.geolocation.getCurrentPosition((position) => {
      loader.importLibrary("geocoding").then(async (geocoder) => {
        new geocoder.Geocoder()
          .geocode({ location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }})
          .then((response) => {
            const stateResult = response.results.find((result) => {
              return result.types.find((type) => {
                return type === 'administrative_area_level_1'
              })
            })

            setCurrentState(stateResult.address_components[0].long_name)
          })
          .catch((e) => window.alert("Geocoder failed due to: " + e));
      });
    })
  }

  return (
    <>
      <button
        className="w-auto p-6 mt-10 text-brand-yellow bg-brand-purple rounded-lg text-[24px] hover:bg-brand-purple w-40 flex justify-center"
        onClick={handleClick}
      >
        {isLoading ? <Image src="/loading-spinner.svg" width="36" height="36" /> : "Find out"}
      </button>
    </>
  )
}
