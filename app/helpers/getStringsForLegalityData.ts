import { track } from '@vercel/analytics'
import { TypedObject } from '@portabletext/types'

import { MainImageType } from '@/app/data/images'
import { GetLegalityDataForLocationReturn } from './getLegalityDataForLocation'
import { CurrentLocation } from '@/app/types'
import { BackgroundColor } from '../contexts/backgroundColorContext'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

export type LegalityStrings = {
  backgroundColor: BackgroundColor
  heading: string
  subHeading: string
  imageType?: MainImageType
  ctaLinkUrl?: string
  ctaButtonText?: string
  overview?: TypedObject[]
}

const getStringsForLegalityData = (
  legalityData: GetLegalityDataForLocationReturn | null,
  currentLocation: CurrentLocation,
  totalLocationCount: number
) => {
  const data: LegalityStrings = {
    backgroundColor: BackgroundColor.YELLOW,
    heading: 'Browse around the world.',
    subHeading: `${totalLocationCount} locations and counting ...`,
    imageType: undefined,
    ctaLinkUrl: undefined,
    ctaButtonText: undefined,
    overview: undefined,
  }

  const closestMatchLocation =
    legalityData &&
    legalityData.closestMatchKey &&
    currentLocation &&
    currentLocation[legalityData.closestMatchKey]

  const closestMatchLegalityData =
    legalityData &&
    legalityData.closestMatchKey &&
    legalityData[legalityData.closestMatchKey]?.isWeedLegalHere

  if (closestMatchLocation && closestMatchLegalityData) {
    data.overview = closestMatchLegalityData?.overview

    if (
      closestMatchLegalityData.medicinal?.legalStatus === 'legal' &&
      closestMatchLegalityData.recreational?.legalStatus === 'legal'
    ) {
      data.backgroundColor = BackgroundColor.GREEN
      data.heading = `Dude! Weed is totally legal in ${closestMatchLocation}.`
      data.subHeading = 'Enjoy it! Need to buy some bud?'
      data.ctaLinkUrl = `https://www.google.com/maps/search/?api=1&query=dispensary+near+${
        currentLocation.postalCode !== DASH_PLACEHOLDER
          ? currentLocation.postalCode
          : legalityData.closestMatchKey
            ? currentLocation[legalityData.closestMatchKey]
            : 'me'
      }`
      data.ctaButtonText = 'Find dispensaries near you'
      data.imageType = MainImageType.Legal
    } else if (
      closestMatchLegalityData.medicinal?.legalStatus === 'illegal' &&
      closestMatchLegalityData.recreational?.legalStatus === 'illegal'
    ) {
      data.backgroundColor = BackgroundColor.RED
      data.heading = `Bruh! Unfortunately, weed is illegal in ${closestMatchLocation}.`
      data.subHeading = 'That blows. But maybe you could help?'
      data.ctaLinkUrl = 'https://norml.org/act/'
      data.ctaButtonText = 'Find out how to take action'
      data.imageType = MainImageType.Illegal
    } else if (
      closestMatchLegalityData.medicinal?.legalStatus === 'unknown' &&
      closestMatchLegalityData.recreational?.legalStatus === 'unknown'
    ) {
      data.heading = `Sorry! We don't know if weed is legal in ${closestMatchLocation} yet.`
      data.subHeading = 'But we are working on it, so check back soon.'
    } else {
      data.heading = `Sort of! Weed is partially legal in ${closestMatchLocation}.`
      data.ctaLinkUrl = `https://www.google.com/maps/search/?api=1&query=dispensary+near+${
        currentLocation.postalCode !== DASH_PLACEHOLDER
          ? currentLocation.postalCode
          : legalityData.closestMatchKey
            ? currentLocation[legalityData.closestMatchKey]
            : 'me'
      }`
      data.ctaButtonText = 'Find dispensaries near you'
      data.imageType = MainImageType.SortOf

      // Beginning of sentence - medical marijuana
      if (closestMatchLegalityData.medicinal?.legalStatus === 'legal') {
        data.subHeading = 'Medical marijuana is legal'
      } else if (
        closestMatchLegalityData.medicinal?.legalStatus === 'illegal'
      ) {
        data.subHeading = 'Medical marijuana is illegal'
      }

      // Sentence connector
      if (
        closestMatchLegalityData.medicinal?.legalStatus === 'legal' &&
        closestMatchLegalityData.recreational?.legalStatus === 'decriminalized'
      ) {
        data.subHeading += ' and '
      } else {
        data.subHeading += ' but '
      }

      // End of sentence - recreational usage
      if (
        closestMatchLegalityData.recreational?.legalStatus === 'decriminalized'
      ) {
        data.subHeading += ' recreational usage is decriminalized'

        if (closestMatchLegalityData.recreational.quantity) {
          data.subHeading += ` up to ${closestMatchLegalityData.recreational.quantity}`
        }
      } else if (
        closestMatchLegalityData.recreational?.legalStatus === 'illegal'
      ) {
        data.subHeading += ' recreational usage is illegal'
      }

      data.subHeading += '.'
    }
  } else if (currentLocation.country !== DASH_PLACEHOLDER) {
    track('data_unknown', {
      country: currentLocation.country,
      postalCode: currentLocation.postalCode,
    })
  }

  return data
}

export default getStringsForLegalityData
