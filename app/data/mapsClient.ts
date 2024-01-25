import { Loader } from '@googlemaps/js-api-loader'

if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
}

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
})

let geocodingClient: Promise<google.maps.GeocodingLibrary | null>

export const getGeocodingClient = () => {
  if (!geocodingClient) {
    geocodingClient = loader.importLibrary('geocoding')
  }

  return geocodingClient
}

let placesClient: Promise<google.maps.PlacesLibrary | null>

export const getPlacesClient = () => {
  if (!placesClient) {
    placesClient = loader.importLibrary('places')
  }

  return placesClient
}
