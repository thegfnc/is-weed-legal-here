import { LegalStatus, LegalityData } from '../data/types'
import marijuanaLegailtyByCountry from '../data/legality-by-country'
import marijuanaLegailtyByAdministrativeAreaLevel1 from '../data/legality-by-administrative-area-level-1'

import { CurrentLocation } from '../components/FindOutButton'

const defaultData = {
  MEDICINAL: LegalStatus.Unknown,
  RECREATIONAL: LegalStatus.Unknown,
  QUANTITY: null,
}

export type ClosestMatchLevel = 'country' | 'administrativeAreaLevel1' | null

export type GetLegalityDataForLocationReturn = LegalityData & {
  closestMatchLevel: ClosestMatchLevel
}

const getLegalityDataForLocation = (
  location: CurrentLocation | null
): GetLegalityDataForLocationReturn | null => {
  if (!location) {
    return null
  }

  let closestMatchLevel: ClosestMatchLevel = null

  const currentCountryData =
    location.country && marijuanaLegailtyByCountry[location.country]

  if (currentCountryData) {
    closestMatchLevel = 'country'
  }

  const currentAdministrativeAreaLevel1Data =
    location.administrativeAreaLevel1 &&
    marijuanaLegailtyByAdministrativeAreaLevel1[
      location.administrativeAreaLevel1
    ]

  if (currentAdministrativeAreaLevel1Data) {
    closestMatchLevel = 'administrativeAreaLevel1'
  }

  console.log('currentCountryData', currentCountryData)
  console.log(
    'currentAdministrativeAreaLevel1Data',
    currentAdministrativeAreaLevel1Data
  )

  const mergedData = {
    ...defaultData,
    ...currentCountryData,
    ...currentAdministrativeAreaLevel1Data,
    closestMatchLevel,
  }

  console.log('mergedData', mergedData)

  return mergedData
}

export default getLegalityDataForLocation
