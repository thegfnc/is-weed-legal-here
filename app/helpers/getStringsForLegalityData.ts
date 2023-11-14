import { CurrentLocation } from '../components/FindOutButton'
import { MainImageType } from '../components/MainImage'
import { GetLegalityDataForLocationReturn } from './getLegalityDataForLocation'

type StringsData = {
  heading: string
  bgColor: string
  subHeading: string
  imageType: MainImageType | null
  ctaLinkUrl: string | null
  ctaButtonText: string
}

const defaultData: StringsData = {
  heading: 'Is weed legal here?',
  bgColor: 'bg-brand-yellow',
  subHeading: '',
  imageType: null,
  ctaLinkUrl: null,
  ctaButtonText: '',
}

const getStringsForLegalityData = (
  legalityData: GetLegalityDataForLocationReturn | null,
  currentLocation: CurrentLocation | null
) => {
  const data = {
    ...defaultData,
  }

  if (legalityData && currentLocation) {
    const closestMatchLocation =
      legalityData.closestMatchLevel &&
      currentLocation[legalityData.closestMatchLevel]

    if (
      legalityData.MEDICINAL === 'Legal' &&
      legalityData.RECREATIONAL === 'Legal'
    ) {
      data.heading = `Dude! Weed is totally legal in ${closestMatchLocation}`
      data.subHeading = 'Enjoy it! Need to buy some bud?'
      data.bgColor = 'bg-brand-green'
      data.ctaLinkUrl = `https://www.google.com/maps/search/?api=1&query=dispensary+near+${currentLocation.postalCode}`
      data.ctaButtonText = 'Find dispensaries near you'
      data.imageType = MainImageType.Legal
    } else if (
      legalityData.MEDICINAL === 'Illegal' &&
      legalityData.RECREATIONAL === 'Illegal'
    ) {
      data.heading = `Bruh! Unfortunately, weed is illegal in ${closestMatchLocation}`
      data.subHeading = 'That’s blows. But maybe you could help?'
      data.bgColor = 'bg-brand-red'
      data.ctaLinkUrl = 'https://norml.org/act/'
      data.ctaButtonText = 'Find out how to take action'
      data.imageType = MainImageType.Illegal
    } else if (
      legalityData.MEDICINAL === 'Unknown' &&
      legalityData.RECREATIONAL === 'Unknown'
    ) {
      data.heading = `Sorry! We don't know if weed is legal in ${closestMatchLocation} yet`
    } else {
      data.heading = `Sort of! Weed is partially legal in ${closestMatchLocation}`
      data.bgColor = 'bg-brand-yellow'
      data.ctaLinkUrl = 'https://norml.org/act/'
      data.ctaButtonText = 'Find out how to take action'

      if (legalityData.MEDICINAL === 'Legal') {
        data.subHeading = 'Medical marijuana is legal'
      }

      if (legalityData.RECREATIONAL === 'Decriminalized') {
        data.subHeading += ' and recreational usage is decriminalized'

        if (legalityData.QUANTITY) {
          data.subHeading += ` with possession of up to ${legalityData.QUANTITY}.`
        } else {
          data.subHeading += '.'
        }
      } else if (legalityData.RECREATIONAL === 'Illegal') {
        data.subHeading += ' but recreational usage is not decriminalized.'
      }
    }
  }

  return data
}

export default getStringsForLegalityData
