'use client'

import { GetLegalityDataForLocationReturn } from '@/app/helpers/getLegalityDataForLocation'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import { useContext, useEffect } from 'react'
import { SetBackgroundColorContext } from '@/app/contexts/backgroundColorContext'
import Result from '@/app/components/Result'
import useFadeIn from '@/app/hooks/useFadeIn'
import { CurrentLocation } from '@/app/types'

type SearchLocationProps = {
  currentLocation: CurrentLocation
  legalityData: GetLegalityDataForLocationReturn | null
}

export default function SearchLocation({
  currentLocation,
  legalityData,
}: SearchLocationProps) {
  const fadeInStyles = useFadeIn()
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const {
    backgroundColor,
    heading,
    subHeading,
    imageType,
    ctaLinkUrl,
    ctaButtonText,
  } = getStringsForLegalityData(legalityData, currentLocation)

  useEffect(() => {
    setBackgroundColor(backgroundColor)
  }, [setBackgroundColor, backgroundColor])

  return (
    <main
      className={
        'flex flex-col items-center gap-12 py-24 text-center ' + fadeInStyles
      }
    >
      <Result
        heading={heading}
        subHeading={subHeading}
        imageType={imageType}
        ctaButtonText={ctaButtonText}
        ctaLinkUrl={ctaLinkUrl}
      />
    </main>
  )
}
