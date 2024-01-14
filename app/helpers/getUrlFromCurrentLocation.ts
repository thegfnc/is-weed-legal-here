import { CurrentLocation } from '@/app/types'

export const DASH_PLACEHOLDER = '-'

export default function getUrlFromCurrentLocation(
  currentLocation: CurrentLocation,
  prefix?: string
) {
  const urlParts = [
    encodeURIComponent(currentLocation.country),
    encodeURIComponent(currentLocation.administrativeAreaLevel1),
    encodeURIComponent(currentLocation.administrativeAreaLevel2),
    encodeURIComponent(currentLocation.locality),
    encodeURIComponent(currentLocation.postalCode),
  ]

  if (prefix) {
    urlParts.unshift(prefix)
  }

  while (urlParts.at(-1) === DASH_PLACEHOLDER) {
    urlParts.pop()
  }

  return urlParts.join('/')
}
