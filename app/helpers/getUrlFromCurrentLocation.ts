import { CurrentLocation } from '@/app/types'

export const DASH_PLACEHOLDER = '-'

export default function getUrlFromCurrentLocation(
  currentLocation: CurrentLocation,
  prefix?: string
) {
  const urlParts = [
    encodeURIComponent(currentLocation.country) || DASH_PLACEHOLDER,
    encodeURIComponent(
      currentLocation.administrativeAreaLevel1 || DASH_PLACEHOLDER
    ),
    encodeURIComponent(
      currentLocation.administrativeAreaLevel2 || DASH_PLACEHOLDER
    ),
    encodeURIComponent(currentLocation.locality || DASH_PLACEHOLDER),
    encodeURIComponent(currentLocation.postalCode || DASH_PLACEHOLDER),
  ]

  if (prefix) {
    urlParts.unshift(prefix)
  }

  while (urlParts.at(-1) === DASH_PLACEHOLDER) {
    urlParts.pop()
  }

  return urlParts.join('/')
}
