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

export type LegalityByAdministrativeAreaLevel1 = CommonLegalityData & {
  administrativeAreaLevel2?: {
    [key: string]: CommonLegalityData
  }
  locality?: {
    [key: string]: CommonLegalityData
  }
}

export type LegalityByCountry = {
  [key: string]: CommonLegalityData & {
    administrativeAreaLevel1?: {
      [key: string]: LegalityByAdministrativeAreaLevel1
    }
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
