'use client'

import MainImage from '@/app/components/MainImage'
import SubHeading from '@/app/components/SubHeading'
import Heading from '@/app/components/Heading'
import CallToActionButton from '@/app/components/CallToActionButton'

import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import { useContext } from 'react'
import { SetBackgroundColorContext } from '@/app/contexts/backgroundColorContext'

type ResultProps = {
  params: {
    currentLocation: string[]
  }
}

export default function Result({ params: { currentLocation } }: ResultProps) {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const partialCurrentLocation = {
    country: decodeURIComponent(currentLocation[0]),
    administrativeAreaLevel1: decodeURIComponent(currentLocation[1]),
    administrativeAreaLevel2: decodeURIComponent(currentLocation[2]),
    locality: decodeURIComponent(currentLocation[3]),
    postalCode: decodeURIComponent(currentLocation[4]),
  }

  const legalityData = getLegalityDataForLocation(partialCurrentLocation)

  const {
    backgroundColor,
    heading,
    subHeading,
    imageType,
    ctaLinkUrl,
    ctaButtonText,
  } = getStringsForLegalityData(legalityData, partialCurrentLocation)

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
