import { track } from '@vercel/analytics/server'

import { MainImageType } from '@/app/data/images'
import { GetLegalityDataForLocationReturn } from './getLegalityDataForLocation'
import { CurrentLocation } from '@/app/types'
import { BackgroundColor } from '../contexts/backgroundColorContext'

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
  currentLocation: CurrentLocation | null
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
        currentLocation.postalCode ||
        currentLocation.locality ||
        currentLocation.administrativeAreaLevel2 ||
        currentLocation.administrativeAreaLevel1 ||
        currentLocation.country
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
      data.ctaLinkUrl = 'https://norml.org/act/'
      data.ctaButtonText = 'Find out how to take action'
      data.imageType = MainImageType.SortOf

      if (closestMatchLegalityData.MEDICINAL === 'Legal') {
        data.subHeading = 'Medical marijuana is legal but'
      } else if (closestMatchLegalityData.MEDICINAL === 'Illegal') {
        data.subHeading = 'Medical marijuana is illegal but'
      }

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
  } else {
    track('Legality data unknown', {
      country: currentLocation?.country || null,
      postalCode: currentLocation?.postalCode || null,
    })
  }

  return data
}

export default getStringsForLegalityData
