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

type MarijuanaLegalityByLocality = CommonLegalityData & {
  locality?: {
    [key: string]: CommonLegalityData
  }
}

type MarijuanaLegalityByAdministrativeAreaLevel2 = CommonLegalityData & {
  administrativeAreaLevel2?: {
    [key: string]: MarijuanaLegalityByLocality
  }
}

type MarijuanaLegalityByAdministrativeAreaLevel1 = CommonLegalityData & {
  administrativeAreaLevel1?: {
    [key: string]: MarijuanaLegalityByAdministrativeAreaLevel2
  }
}

export type MarijuanaLegalityByCountry = {
  [key: string]: MarijuanaLegalityByAdministrativeAreaLevel1
}
