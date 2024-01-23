import pick from 'lodash.pick'

import { CommonLegalityData } from '@/app/types'
import legailtyByCountry from '@/app/data/legality-by-country'
import { CurrentLocation } from '@/app/types'

export type ClosestMatchKey =
  | 'country'
  | 'administrativeAreaLevel1'
  | 'administrativeAreaLevel2'
  | 'locality'

export type GetLegalityDataForLocationReturn = {
  country?: CommonLegalityData
  administrativeAreaLevel1?: CommonLegalityData
  administrativeAreaLevel2?: CommonLegalityData
  locality?: CommonLegalityData
  closestMatchKey?: ClosestMatchKey
}

const getLegalityDataForLocation = (
  location: CurrentLocation
): GetLegalityDataForLocationReturn | null => {
  const legalityData: GetLegalityDataForLocationReturn = {}

  ////////////////
  // COUNTRY
  ////////////////////////////////
  const countryMatch = legailtyByCountry[location.country]

  if (countryMatch) {
    legalityData.country = pick(countryMatch, [
      'MEDICINAL',
      'RECREATIONAL',
      'QUANTITY',
    ])
    legalityData.closestMatchKey = 'country'
  }

  ////////////////
  // ADMINISTRATIVE AREA LEVEL 1 (US States)
  ////////////////////////////////
  const administrativeAreaLevel1Match =
    countryMatch &&
    countryMatch.administrativeAreaLevel1 &&
    location.administrativeAreaLevel1 &&
    countryMatch.administrativeAreaLevel1[location.administrativeAreaLevel1]

  if (administrativeAreaLevel1Match) {
    legalityData.administrativeAreaLevel1 = pick(
      administrativeAreaLevel1Match,
      ['MEDICINAL', 'RECREATIONAL', 'QUANTITY']
    )
    legalityData.closestMatchKey = 'administrativeAreaLevel1'
  }

  ////////////////
  // ADMINISTRATIVE AREA LEVEL 2 (US Counties)
  ////////////////////////////////
  const administrativeAreaLevel2Match =
    administrativeAreaLevel1Match &&
    administrativeAreaLevel1Match.administrativeAreaLevel2 &&
    location.administrativeAreaLevel2 &&
    administrativeAreaLevel1Match.administrativeAreaLevel2[
      location.administrativeAreaLevel2
    ]

  if (administrativeAreaLevel2Match) {
    legalityData.administrativeAreaLevel2 = pick(
      administrativeAreaLevel2Match,
      ['MEDICINAL', 'RECREATIONAL', 'QUANTITY']
    )
    legalityData.closestMatchKey = 'administrativeAreaLevel2'
  }

  ////////////////
  // LOCALITY (US Cities)
  ////////////////////////////////
  const localityMatch =
    administrativeAreaLevel1Match &&
    administrativeAreaLevel1Match.locality &&
    location.locality &&
    administrativeAreaLevel1Match.locality[location.locality]

  if (localityMatch) {
    legalityData.locality = pick(localityMatch, [
      'MEDICINAL',
      'RECREATIONAL',
      'QUANTITY',
    ])
    legalityData.closestMatchKey = 'locality'
  }

  if (legalityData.closestMatchKey) {
    return legalityData
  }

  return null
}

export default getLegalityDataForLocation
