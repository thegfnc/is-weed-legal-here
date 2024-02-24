import { track } from '@vercel/analytics'

import { MainImageType } from '@/app/data/images'
import { GetLegalityDataForLocationReturn } from './getLegalityDataForLocation'
import { CurrentLocation } from '@/app/types'
import { BackgroundColor } from '../contexts/backgroundColorContext'
import { DASH_PLACEHOLDER } from './getUrlFromCurrentLocation'

type StringsData = {
  backgroundColor: BackgroundColor
  heading: string
  subHeading: string
  imageType: MainImageType | null
  ctaLinkUrl: string | null
  ctaButtonText: string
}

const getStringsForLegalityData = (
  legalityData: GetLegalityDataForLocationReturn | null,
  currentLocation: CurrentLocation
) => {
  const data: StringsData = {
    backgroundColor: BackgroundColor.YELLOW,
    heading: "Sorry! We don't know if weed is legal in your location yet.",
    subHeading: '',
    imageType: null,
    ctaLinkUrl: null,
    ctaButtonText: '',
  }

  const closestMatchLocation =
    legalityData &&
    legalityData.closestMatchKey &&
    currentLocation &&
    currentLocation[legalityData.closestMatchKey]

  const closestMatchLegalityData =
    legalityData &&
    legalityData.closestMatchKey &&
    legalityData[legalityData.closestMatchKey]

  if (closestMatchLocation && closestMatchLegalityData) {
    if (
      closestMatchLegalityData.MEDICINAL === 'Legal' &&
      closestMatchLegalityData.RECREATIONAL === 'Legal'
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
      closestMatchLegalityData.MEDICINAL === 'Illegal' &&
      closestMatchLegalityData.RECREATIONAL === 'Illegal'
    ) {
      data.backgroundColor = BackgroundColor.RED
      data.heading = `Bruh! Unfortunately, weed is illegal in ${closestMatchLocation}.`
      data.subHeading = 'That blows. But maybe you could help?'
      data.ctaLinkUrl = 'https://norml.org/act/'
      data.ctaButtonText = 'Find out how to take action'
      data.imageType = MainImageType.Illegal
    } else if (
      closestMatchLegalityData.MEDICINAL === 'Unknown' &&
      closestMatchLegalityData.RECREATIONAL === 'Unknown'
    ) {
      data.heading = `Sorry! We don't know if weed is legal in ${closestMatchLocation} yet.`
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
      if (closestMatchLegalityData.MEDICINAL === 'Legal') {
        data.subHeading = 'Medical marijuana is legal'
      } else if (closestMatchLegalityData.MEDICINAL === 'Illegal') {
        data.subHeading = 'Medical marijuana is illegal'
      }

      // Sentence connector
      if (
        closestMatchLegalityData.MEDICINAL === 'Legal' &&
        closestMatchLegalityData.RECREATIONAL === 'Decriminalized'
      ) {
        data.subHeading += ' and '
      } else {
        data.subHeading += ' but '
      }

      // End of sentence - recreational usage
      if (closestMatchLegalityData.RECREATIONAL === 'Decriminalized') {
        data.subHeading += ' recreational usage is decriminalized'

        if (closestMatchLegalityData.QUANTITY) {
          data.subHeading += ` up to ${closestMatchLegalityData.QUANTITY}`
        }
      } else if (closestMatchLegalityData.RECREATIONAL === 'Illegal') {
        data.subHeading += ' recreational usage is illegal'
      }

      data.subHeading += '.'
    }
  } else if (currentLocation.country !== DASH_PLACEHOLDER) {
    track('Legality data unknown', {
      country: currentLocation.country,
      postalCode: currentLocation.postalCode,
    })
  }

  return data
}

export default getStringsForLegalityData
