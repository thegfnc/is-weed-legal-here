import { LegalStatus, CommonLegalityData } from '@/app/types'
import legailtyByCountry from '@/app/data/legality-by-country'
import { CurrentLocation } from '@/app/types'

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

  return mergedData
}

export default getLegalityDataForLocation
