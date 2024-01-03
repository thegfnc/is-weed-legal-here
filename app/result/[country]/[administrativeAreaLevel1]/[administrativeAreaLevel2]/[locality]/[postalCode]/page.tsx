import Header from '../../../../../../components/Header'
import Footer from '../../../../../../components/Footer'
import MainImage from '../../../../../../components/MainImage'
import SubHeading from '../../../../../../components/SubHeading'
import Heading from '../../../../../../components/Heading'
import CallToActionButton from '../../../../../../components/CallToActionButton'

import getLegalityDataForLocation from '../../../../../../helpers/getLegalityDataForLocation'
import getStringsForLegalityData from '../../../../../../helpers/getStringsForLegalityData'
import { CurrentLocation } from '../../../../../../types'

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
    <>
      <div
        className={`flex min-h-[100dvh] w-screen flex-col items-center justify-between ${bgColor} px-6 py-6 text-center text-brand-purple transition-colors duration-500 md:py-10`}
      >
        <Header isVisible={true} />
        <main className='flex flex-col items-center py-24'>
          <Heading text={heading} />
          {subHeading && <SubHeading text={subHeading} />}
          {imageType && <MainImage type={imageType} />}
          {ctaLinkUrl && (
            <CallToActionButton text={ctaButtonText} linkUrl={ctaLinkUrl} />
          )}
        </main>
        <Footer />
      </div>
    </>
  )
}
