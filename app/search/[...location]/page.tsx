'use client'

import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import { useContext, useEffect } from 'react'
import { SetBackgroundColorContext } from '@/app/contexts/backgroundColorContext'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import Result from '@/app/components/Result'
import useFadeIn from '@/app/hooks/useFadeIn'

type ResultProps = {
  params: {
    location: string[]
  }
}

export default function SearchResult({ params: { location } }: ResultProps) {
  const fadeInStyles = useFadeIn()
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const currentLocation = getCurrentLocationFromUrlParams(location)
  const legalityData = getLegalityDataForLocation(currentLocation)

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
