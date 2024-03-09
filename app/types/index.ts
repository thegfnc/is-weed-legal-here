import { TypedObject } from '@portabletext/types'

export type CurrentLocation = {
  country: string
  administrativeAreaLevel1: string
  administrativeAreaLevel2: string
  locality: string
  postalCode: string
}

export type MedicinalLegalStatus = 'illegal' | 'legal' | 'unknown'

export type CommonLegalStatus =
  | 'illegal'
  | 'legal'
  | 'decriminalized'
  | 'unknown'

type CMSLocationCommon = {
  name: string
  isWeedLegalHere?: {
    overview?: TypedObject[]
    medicinal?: {
      legalStatus?: MedicinalLegalStatus
      quantity?: string
    }
    recreational?: {
      legalStatus?: CommonLegalStatus
      quantity?: string
    }
    thca?: {
      legalStatus?: CommonLegalStatus
      quantity?: string
    }
    delta9?: {
      legalStatus?: CommonLegalStatus
      quantity?: string
    }
    delta8?: {
      legalStatus?: CommonLegalStatus
      quantity?: string
    }
    cbd?: {
      legalStatus?: CommonLegalStatus
      quantity?: string
    }
  }
}

export type CMSLocality = CMSLocationCommon

export type CMSAdministrativeAreaLevel2 = CMSLocationCommon

export type CMSAdministrativeAreaLevel1 = CMSLocationCommon & {
  administrativeAreaLevel2?: {
    children?: CMSAdministrativeAreaLevel2[]
  }
  locality?: {
    children?: CMSLocality[]
  }
}

export type CMSCountry = CMSLocationCommon & {
  labels?: {
    administrativeAreaLevel1?: {
      singular?: string
      plural?: string
    }
    administrativeAreaLevel2?: {
      singular?: string
      plural?: string
    }
    locality?: {
      singular?: string
      plural?: string
    }
  }
  administrativeAreaLevel1?: {
    children?: CMSAdministrativeAreaLevel1[]
  }
}
