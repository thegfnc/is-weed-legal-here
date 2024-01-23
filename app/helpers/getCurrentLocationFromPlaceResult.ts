import { CurrentLocation } from '@/app/types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

export default function getCurrentLocationFromPlaceResult(
  result: google.maps.places.PlaceResult
): CurrentLocation {
  const { address_components } = result

  const country = address_components?.find(component =>
    component.types.includes('country')
  )?.long_name

  // US states are administrative_area_level_1
  const administrativeAreaLevel1 = address_components?.find(component =>
    component.types.includes('administrative_area_level_1')
  )?.long_name

  // US counties are administrative_area_level_2
  const administrativeAreaLevel2 = address_components?.find(component =>
    component.types.includes('administrative_area_level_2')
  )?.long_name

  // US cities are locality
  const locality = address_components?.find(component =>
    component.types.includes('locality')
  )?.long_name

  const postalCode = address_components?.find(component =>
    component.types.includes('postal_code')
  )?.long_name

  return {
    country: country || DASH_PLACEHOLDER,
    administrativeAreaLevel1: administrativeAreaLevel1 || DASH_PLACEHOLDER,
    administrativeAreaLevel2: administrativeAreaLevel2 || DASH_PLACEHOLDER,
    locality: locality || DASH_PLACEHOLDER,
    postalCode: postalCode || DASH_PLACEHOLDER,
  }
}
