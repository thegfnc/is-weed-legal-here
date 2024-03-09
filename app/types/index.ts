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
        plural: string | undefined
        singular: string | undefined
      }
      administrativeAreaLevel2?: {
        plural: string | undefined
        singular: string | undefined
      }
      locality?: {
        plural: string | undefined
        singular: string | undefined
      }
    }
  }
}

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
