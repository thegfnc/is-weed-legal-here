'use client'

import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import { useContext, useEffect } from 'react'
import { SetBackgroundColorContext } from '@/app/contexts/backgroundColorContext'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import Result from '@/app/components/Result'
import useFadeIn from '@/app/hooks/useFadeIn'
import transformCMSDataToLegalityByCountry, {
  CMSCountry,
} from '@/app/helpers/transformCMSDataToLegalityByCountry'
import { useQuery } from '@tanstack/react-query'
import { sanityFetch } from '@/app/data/client'

type ResultProps = {
  params: {
    location: string[]
  }
}

const COUNTRY_MATCH_QUERY = `
  *[_type == 'IIHD_country' && name == $country] | order(name) {
    name,
    isWeedLegalHere,
    labels,
    administrativeAreaLevel1 {
      children[]-> {
        name,
        isWeedLegalHere,
        administrativeAreaLevel2 {
          children[]-> {
            name,
            isWeedLegalHere
          }
        },
        locality {
          children[]-> {
            name,
            isWeedLegalHere
          }
        }
      }
    }
  }
`

export default function SearchResult({ params: { location } }: ResultProps) {
  const fadeInStyles = useFadeIn()
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const currentLocation = getCurrentLocationFromUrlParams(location)

  const { data } = useQuery<CMSCountry[]>({
    queryKey: ['browse', location],
    queryFn: () =>
      sanityFetch({
        query: COUNTRY_MATCH_QUERY,
        params: { country: currentLocation.country },
      }),
  })

  const transformedData = transformCMSDataToLegalityByCountry(data)

  const legalityData = getLegalityDataForLocation(
    currentLocation,
    transformedData
  )

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
