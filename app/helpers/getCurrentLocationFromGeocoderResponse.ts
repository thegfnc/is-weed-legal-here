import { CurrentLocation } from '@/app/types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

export default function getCurrentLocationFromGeocoderResponse(
  response: google.maps.GeocoderResponse
): CurrentLocation {
  const { results } = response

  const country = results.find(result => result.types.includes('country'))
    ?.address_components[0].long_name

  // US states are administrative_area_level_1
  const administrativeAreaLevel1 = results.find(result =>
    result.types.includes('administrative_area_level_1')
  )?.address_components[0].long_name

  // US counties are administrative_area_level_2
  const administrativeAreaLevel2 = results.find(result =>
    result.types.includes('administrative_area_level_2')
  )?.address_components[0].long_name

  // US cities are locality
  const locality = results.find(result => result.types.includes('locality'))
    ?.address_components[0].long_name

  const postalCode = results.find(result =>
    result.types.includes('postal_code')
  )?.address_components[0].long_name

  return {
    country: country || DASH_PLACEHOLDER,
    administrativeAreaLevel1: administrativeAreaLevel1 || DASH_PLACEHOLDER,
    administrativeAreaLevel2: administrativeAreaLevel2 || DASH_PLACEHOLDER,
    locality: locality || DASH_PLACEHOLDER,
    postalCode: postalCode || DASH_PLACEHOLDER,
  }
}
