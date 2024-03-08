export type CurrentLocation = {
  country: string
  administrativeAreaLevel1: string
  administrativeAreaLevel2: string
  locality: string
  postalCode: string
}

export enum LegalStatus {
  Legal = 'Legal',
  Illegal = 'Illegal',
  Decriminalized = 'Decriminalized',
  Unknown = 'Unknown',
}

export type CommonLegalityData = {
  MEDICINAL: LegalStatus
  RECREATIONAL: LegalStatus
  QUANTITY: string | null
}

type LegalityByLocalityValue = CommonLegalityData

export type LegalityByLocality = {
  [key: string]: LegalityByLocalityValue
}

type LegalityByAdministrativeAreaLevel2Value = CommonLegalityData

export type LegalityByAdministrativeAreaLevel2 = {
  [key: string]: LegalityByAdministrativeAreaLevel2Value
}

type LegalityByAdministrativeAreaLevel1Value = CommonLegalityData & {
  administrativeAreaLevel2?: LegalityByAdministrativeAreaLevel2
  locality?: LegalityByLocality
}

export type LegalityByAdministrativeAreaLevel1 = {
  [key: string]: LegalityByAdministrativeAreaLevel1Value
}

export type LegalityByCountry = {
  [key: string]: CommonLegalityData & {
    administrativeAreaLevel1?: LegalityByAdministrativeAreaLevel1
    labels?: {
      administrativeAreaLevel1?: {
        plural: string
        singular: string
      }
      administrativeAreaLevel2?: {
        plural: string
        singular: string
      }
      locality?: {
        plural: string
        singular: string
      }
    }
  }
}
