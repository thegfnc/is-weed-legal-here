import MainImage from '@/app/components/MainImage'
import SubHeading from '@/app/components/SubHeading'
import Heading from '@/app/components/Heading'
import CallToActionButton from '@/app/components/CallToActionButton'

import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import { CurrentLocation } from '@/app/types'

type ResultProps = {
  params: CurrentLocation
}

export default function Result({
  params: {
    country,
    administrativeAreaLevel1,
    administrativeAreaLevel2,
    locality,
    postalCode,
  },
}: ResultProps) {
  const currentLocation = {
    country: decodeURIComponent(country),
    administrativeAreaLevel1: decodeURIComponent(administrativeAreaLevel1),
    administrativeAreaLevel2: decodeURIComponent(administrativeAreaLevel2),
    locality: decodeURIComponent(locality),
    postalCode: decodeURIComponent(postalCode),
  }

  const legalityData = getLegalityDataForLocation(currentLocation)
  const { bgColor, heading, subHeading, imageType, ctaLinkUrl, ctaButtonText } =
    getStringsForLegalityData(legalityData, currentLocation)

  return (
    <main className='flex flex-col items-center py-24'>
      <Heading text={heading} />
      {subHeading && <SubHeading text={subHeading} />}
      {imageType && <MainImage type={imageType} />}
      {ctaLinkUrl && (
        <CallToActionButton text={ctaButtonText} linkUrl={ctaLinkUrl} />
      )}
    </main>
  )
}
