import { LegalStatus, CommonLegalityData } from '../data/types'
import marijuanaLegailtyByCountry from '../data/legality-by-country'

import { CurrentLocation } from '../components/FindOutButton'

const defaultData = {
  MEDICINAL: LegalStatus.Unknown,
  RECREATIONAL: LegalStatus.Unknown,
  QUANTITY: null,
}

export type ClosestMatchLevel = 'country' | 'administrativeAreaLevel1' | null

export type GetLegalityDataForLocationReturn = CommonLegalityData & {
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
    currentCountryData &&
    currentCountryData.administrativeAreaLevel1 &&
    location.administrativeAreaLevel1 &&
    currentCountryData.administrativeAreaLevel1[
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

  // console.log('mergedData', mergedData)

  return mergedData
}

export default getLegalityDataForLocation
