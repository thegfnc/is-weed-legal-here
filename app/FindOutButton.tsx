'use client'

import { Loader } from "@googlemaps/js-api-loader"

const loader = new Loader({
  apiKey: "AIzaSyAtFp26-bVYD6DfUZwl_FvhGh0XhScKEI0",
  version: "weekly",
});

export default function FindOutButton({setCurrentState}) {

  if (!globalThis.navigator?.geolocation) {
    console.log('geolocation is not available')
  }

  const handleClick = () => {
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
        className="w-auto p-6 mt-10 text-brand-yellow bg-brand-purple rounded-lg text-[24px] hover:bg-brand-purple"
        onClick={handleClick}
      >
        Find out
      </button>
    </>
  )
}
