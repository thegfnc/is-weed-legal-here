export type CurrentLocation = {
  country?: string
  administrativeAreaLevel1?: string
  administrativeAreaLevel2?: string
  locality?: string
  postalCode?: string
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

type LegalityByAdministrativeAreaLevel1 = CommonLegalityData & {
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
  }
}
