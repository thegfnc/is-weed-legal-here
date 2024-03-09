import {
  LegalStatus,
  LegalityByAdministrativeAreaLevel1,
  LegalityByAdministrativeAreaLevel2,
  LegalityByCountry,
  LegalityByLocality,
} from '../types'

type CMSLocationCommon = {
  name: string
  isWeedLegalHere: {
    medicinal: {
      legalStatus: 'illegal' | 'legal' | 'unknown'
    }
    recreational: {
      legalStatus: 'illegal' | 'legal' | 'decriminalized' | 'unknown'
      quantity: string
    }
  }
}

type CMSAdministrativeAreaLevel1 = CMSLocationCommon & {
  administrativeAreaLevel2?: {
    children: CMSLocationCommon[]
  }
  locality?: {
    children: CMSLocationCommon[]
  }
}

export type CMSCountry = CMSLocationCommon & {
  labels: {
    administrativeAreaLevel1?: {
      singular: string
      plural: string
    }
    administrativeAreaLevel2?: {
      singular: string
      plural: string
    }
    locality?: {
      singular: string
      plural: string
    }
  }
  administrativeAreaLevel1?: {
    children: CMSAdministrativeAreaLevel1[]
  }
}

const getLegalStatusFromString = (legalStatus: string): LegalStatus => {
  switch (legalStatus) {
    case 'illegal':
      return LegalStatus.Illegal
    case 'legal':
      return LegalStatus.Legal
    case 'decriminalized':
      return LegalStatus.Decriminalized
    default:
      return LegalStatus.Unknown
  }
}

export default function transformCMSDataToLegalityByCountry(
  data: CMSCountry[] | undefined
): LegalityByCountry {
  if (!data) {
    return {}
  }

  const transformedData: LegalityByCountry = {}

  data.forEach(country => {
    transformedData[country.name] = {
      MEDICINAL: getLegalStatusFromString(
        country.isWeedLegalHere.medicinal.legalStatus
      ),
      RECREATIONAL: getLegalStatusFromString(
        country.isWeedLegalHere.recreational.legalStatus
      ),
      QUANTITY: country.isWeedLegalHere.recreational.quantity || null,
      labels: {
        administrativeAreaLevel1: {
          singular: country.labels?.administrativeAreaLevel1?.singular,
          plural: country.labels?.administrativeAreaLevel1?.plural,
        },
        administrativeAreaLevel2: {
          singular: country.labels?.administrativeAreaLevel2?.singular,
          plural: country.labels?.administrativeAreaLevel2?.plural,
        },
        locality: {
          singular: country.labels?.locality?.singular,
          plural: country.labels?.locality?.plural,
        },
      },
    }

    if (country.administrativeAreaLevel1?.children.length) {
      const transformedAdministrativeAreaLevel1: LegalityByAdministrativeAreaLevel1 =
        {}

      transformedData[country.name].administrativeAreaLevel1 =
        transformedAdministrativeAreaLevel1

      country.administrativeAreaLevel1?.children.forEach(
        administrativeArea1 => {
          transformedAdministrativeAreaLevel1[administrativeArea1.name] = {
            MEDICINAL: getLegalStatusFromString(
              administrativeArea1.isWeedLegalHere.medicinal.legalStatus
            ),
            RECREATIONAL: getLegalStatusFromString(
              administrativeArea1.isWeedLegalHere.recreational.legalStatus
            ),
            QUANTITY:
              administrativeArea1.isWeedLegalHere.recreational.quantity || null,
          }

          if (administrativeArea1.administrativeAreaLevel2?.children.length) {
            const transformedAdministrativeAreaLevel2: LegalityByAdministrativeAreaLevel2 =
              {}

            transformedAdministrativeAreaLevel1[
              administrativeArea1.name
            ].administrativeAreaLevel2 = transformedAdministrativeAreaLevel2

            administrativeArea1.administrativeAreaLevel2.children.forEach(
              administrativeArea2 => {
                transformedAdministrativeAreaLevel2[administrativeArea2.name] =
                  {
                    MEDICINAL: getLegalStatusFromString(
                      administrativeArea2.isWeedLegalHere.medicinal.legalStatus
                    ),
                    RECREATIONAL: getLegalStatusFromString(
                      administrativeArea2.isWeedLegalHere.recreational
                        .legalStatus
                    ),
                    QUANTITY:
                      administrativeArea2.isWeedLegalHere.recreational
                        .quantity || null,
                  }
              }
            )
          }

          if (administrativeArea1.locality?.children.length) {
            const transformedLocality: LegalityByLocality = {}

            transformedAdministrativeAreaLevel1[
              administrativeArea1.name
            ].locality = transformedLocality

            administrativeArea1.locality.children.forEach(locality => {
              transformedLocality[locality.name] = {
                MEDICINAL: getLegalStatusFromString(
                  locality.isWeedLegalHere.medicinal.legalStatus
                ),
                RECREATIONAL: getLegalStatusFromString(
                  locality.isWeedLegalHere.recreational.legalStatus
                ),
                QUANTITY:
                  locality.isWeedLegalHere.recreational.quantity || null,
              }
            })
          }
        }
      )
    }
  })

  return transformedData
}
