'use client'

import MainImage from '@/app/components/MainImage'
import SubHeading from '@/app/components/SubHeading'
import Heading from '@/app/components/Heading'
import CallToActionButton from '@/app/components/CallToActionButton'

import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import { CurrentLocation } from '@/app/types'
import { useContext } from 'react'
import { SetBackgroundColorContext } from '@/app/contexts/backgroundColorContext'

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
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const currentLocation = {
    country: decodeURIComponent(country),
    administrativeAreaLevel1: decodeURIComponent(administrativeAreaLevel1),
    administrativeAreaLevel2: decodeURIComponent(administrativeAreaLevel2),
    locality: decodeURIComponent(locality),
    postalCode: decodeURIComponent(postalCode),
  }

  const legalityData = getLegalityDataForLocation(currentLocation)
  const {
    backgroundColor,
    heading,
    subHeading,
    imageType,
    ctaLinkUrl,
    ctaButtonText,
  } = getStringsForLegalityData(legalityData, currentLocation)

  setBackgroundColor(backgroundColor)

  return (
    <main className='flex flex-col items-center py-24 text-center'>
      <div className='max-w-6xl'>
        <Heading text={heading} />
      </div>
      {subHeading && <SubHeading text={subHeading} />}
      {imageType && <MainImage type={imageType} />}
      {ctaLinkUrl && (
        <CallToActionButton text={ctaButtonText} linkUrl={ctaLinkUrl} />
      )}
    </main>
  )
}
