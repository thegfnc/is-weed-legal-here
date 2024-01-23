import legailtyByCountry from '@/app/data/legality-by-country'
import {
  CurrentLocation,
  LegalityByCountry,
  LegalityByAdministrativeAreaLevel1,
} from '@/app/types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

type ChildLocations = {
  key: keyof CurrentLocation
  data: LegalityByCountry | LegalityByAdministrativeAreaLevel1
}

export default function getChildLocationsFromLocation(
  location: CurrentLocation
): ChildLocations[] {
  if (location.country === DASH_PLACEHOLDER) {
    return [
      {
        key: 'country',
        data: legailtyByCountry,
      },
    ]
  }

  const countryMatch = legailtyByCountry[location.country]

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
        data: { ...administrativeAreaLevel1Match.locality },
      },
      {
        key: 'administrativeAreaLevel2',
        data: {
          ...administrativeAreaLevel1Match.administrativeAreaLevel2,
        },
      },
    ]
  }

  if (countryMatch) {
    return [
      {
        key: 'administrativeAreaLevel1',
        data: { ...countryMatch.administrativeAreaLevel1 },
      },
    ]
  }

  return []
}
