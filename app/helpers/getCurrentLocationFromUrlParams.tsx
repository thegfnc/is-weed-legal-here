import { CurrentLocation } from '../types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

export default function getCurrentLocationFromUrlParams(
  location: string[]
): CurrentLocation {
  return {
    country: decodeURIComponent(location[0] || DASH_PLACEHOLDER),
    administrativeAreaLevel1: decodeURIComponent(
      location[1] || DASH_PLACEHOLDER
    ),
    administrativeAreaLevel2: decodeURIComponent(
      location[2] || DASH_PLACEHOLDER
    ),
    locality: decodeURIComponent(location[3] || DASH_PLACEHOLDER),
    postalCode: decodeURIComponent(location[4] || DASH_PLACEHOLDER),
  }
}
