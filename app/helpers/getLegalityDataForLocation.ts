import { LegalStatus, CommonLegalityData } from '../data/types'
import legailtyByCountry from '../data/legality-by-country'

import { CurrentLocation } from '../components/FindOutButton'

const defaultData = {
  MEDICINAL: LegalStatus.Unknown,
  RECREATIONAL: LegalStatus.Unknown,
  QUANTITY: null,
}

export type ClosestMatchLevel =
  | 'country'
  | 'administrativeAreaLevel1'
  | 'administrativeAreaLevel2'
  | 'locality'
  | null

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

  ////////////////
  // COUNTRY
  ////////////////////////////////
  const currentCountryData =
    location.country && legailtyByCountry[location.country]

  if (currentCountryData) {
    closestMatchLevel = 'country'
  }

  console.log('currentCountryData', currentCountryData)

  ////////////////
  // ADMINISTRATIVE AREA LEVEL 1 (US States)
  ////////////////////////////////
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

  console.log(
    'currentAdministrativeAreaLevel1Data',
    currentAdministrativeAreaLevel1Data
  )

  ////////////////
  // ADMINISTRATIVE AREA LEVEL 2 (US Counties)
  ////////////////////////////////
  const currentAdministrativeAreaLevel2Data =
    currentAdministrativeAreaLevel1Data &&
    currentAdministrativeAreaLevel1Data.administrativeAreaLevel2 &&
    location.administrativeAreaLevel2 &&
    currentAdministrativeAreaLevel1Data.administrativeAreaLevel2[
      location.administrativeAreaLevel2
    ]

  if (currentAdministrativeAreaLevel2Data) {
    closestMatchLevel = 'administrativeAreaLevel2'
  }

  console.log(
    'currentAdministrativeAreaLevel2Data',
    currentAdministrativeAreaLevel2Data
  )

  ////////////////
  // LOCALITY (US Cities)
  ////////////////////////////////
  const currentLocalityData =
    currentAdministrativeAreaLevel1Data &&
    currentAdministrativeAreaLevel1Data.locality &&
    location.locality &&
    currentAdministrativeAreaLevel1Data.locality[location.locality]

  if (currentLocalityData) {
    closestMatchLevel = 'locality'
  }

  console.log('currentLocalityData', currentLocalityData)

  ////////////////
  // DATA MERGE
  ////////////////////////////////
  const mergedData = {
    ...defaultData,
    ...currentCountryData,
    ...currentAdministrativeAreaLevel1Data,
    ...currentAdministrativeAreaLevel2Data,
    ...currentLocalityData,
    closestMatchLevel,
  }

  console.log('mergedData', mergedData)

  return mergedData
}

export default getLegalityDataForLocation
