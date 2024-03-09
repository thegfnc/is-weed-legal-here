import {
  CurrentLocation,
  LegalityByCountry,
  LegalityByAdministrativeAreaLevel1,
} from '@/app/types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

export type ChildLocations = {
  key: keyof CurrentLocation
  label?: {
    singular: string | undefined
    plural: string | undefined
  }
  names: string[]
}

export default function getChildLocationsFromLocation(
  location: CurrentLocation,
  data: LegalityByCountry
): ChildLocations[] {
  if (location.country === DASH_PLACEHOLDER) {
    return [
      {
        key: 'country',
        names: Object.keys(data).sort((a, b) => a.localeCompare(b)),
      },
    ]
  }

  const countryMatch = data[location.country]

  const administrativeAreaLevel1Match =
    countryMatch &&
    countryMatch.administrativeAreaLevel1 &&
    location.administrativeAreaLevel1 &&
    countryMatch.administrativeAreaLevel1[location.administrativeAreaLevel1]

  const administrativeAreaLevel2Match =
    administrativeAreaLevel1Match &&
    administrativeAreaLevel1Match.administrativeAreaLevel2 &&
    location.administrativeAreaLevel2 &&
    administrativeAreaLevel1Match.administrativeAreaLevel2[
      location.administrativeAreaLevel2
    ]

  const localityMatch =
    administrativeAreaLevel1Match &&
    administrativeAreaLevel1Match.locality &&
    location.locality &&
    administrativeAreaLevel1Match.locality[location.locality]

  if (localityMatch || administrativeAreaLevel2Match) {
    return []
  }

  if (administrativeAreaLevel1Match) {
    return [
      {
        key: 'locality',
        label: {
          singular: countryMatch.labels?.locality?.singular,
          plural: countryMatch.labels?.locality?.plural,
        },
        names: Object.keys(administrativeAreaLevel1Match.locality || {}).sort(
          (a, b) => a.localeCompare(b)
        ),
      },
      {
        key: 'administrativeAreaLevel2',
        label: {
          singular: countryMatch.labels?.administrativeAreaLevel2?.singular,
          plural: countryMatch.labels?.administrativeAreaLevel2?.plural,
        },
        names: Object.keys(
          administrativeAreaLevel1Match.administrativeAreaLevel2 || {}
        ).sort((a, b) => a.localeCompare(b)),
      },
    ]
  }

  if (countryMatch) {
    return [
      {
        key: 'administrativeAreaLevel1',
        label: {
          singular: countryMatch.labels?.administrativeAreaLevel1?.singular,
          plural: countryMatch.labels?.administrativeAreaLevel1?.plural,
        },
        names: Object.keys(countryMatch.administrativeAreaLevel1 || {}).sort(
          (a, b) => a.localeCompare(b)
        ),
      },
    ]
  }

  return []
}
