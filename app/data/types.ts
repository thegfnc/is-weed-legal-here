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

type MarijuanaLegalityByAdministrativeAreaLevel2 = CommonLegalityData & {
  locality?: {
    [key: string]: CommonLegalityData
  }
}

type MarijuanaLegalityByAdministrativeAreaLevel1 = CommonLegalityData & {
  administrativeAreaLevel2?: {
    [key: string]: MarijuanaLegalityByAdministrativeAreaLevel2
  }
}

export type MarijuanaLegalityByCountry = {
  [key: string]: CommonLegalityData & {
    administrativeAreaLevel1?: {
      [key: string]: MarijuanaLegalityByAdministrativeAreaLevel1
    }
  }
}
