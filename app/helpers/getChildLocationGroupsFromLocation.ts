import legailtyByCountry from '@/app/data/legalityByCountry'
import {
  CurrentLocation,
  LegalityByCountry,
  LegalityByAdministrativeAreaLevel1,
} from '@/app/types'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

type ChildLocations = {
  key: keyof CurrentLocation
  label?: {
    singular: string | undefined
    plural: string | undefined
  }
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
        key: 'administrativeAreaLevel2',
        label: {
          singular: countryMatch.labels?.administrativeAreaLevel2?.singular,
          plural: countryMatch.labels?.administrativeAreaLevel2?.plural,
        },
        data: {
          ...administrativeAreaLevel1Match.administrativeAreaLevel2,
        },
      },
      {
        key: 'locality',
        label: {
          singular: countryMatch.labels?.locality?.singular,
          plural: countryMatch.labels?.locality?.plural,
        },
        data: { ...administrativeAreaLevel1Match.locality },
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
        data: { ...countryMatch.administrativeAreaLevel1 },
      },
    ]
  }

  return []
}
