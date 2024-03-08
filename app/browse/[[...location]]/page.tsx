'use client'

import { useContext, useEffect } from 'react'
import Link from 'next/link'
import { SetBackgroundColorContext } from '@/app/contexts/backgroundColorContext'
import getChildLocationsFromLocation from '@/app/helpers/getChildLocationGroupsFromLocation'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '@/app/helpers/getUrlFromCurrentLocation'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import { HeadingSizes } from '@/app/components/Heading'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import Result from '@/app/components/Result'
import useFadeIn from '@/app/hooks/useFadeIn'
import { useQuery } from '@tanstack/react-query'
import { sanityFetch } from '@/app/data/client'
import transformCMSDataToLegalityByCountry, {
  CMSCountry,
} from '@/app/helpers/transformCMSDataToLegalityByCountry'

type BrowseProps = {
  params: {
    location: string[]
  }
}

const ALL_COUNTRIES_QUERY = `
  *[_type == 'IIHD_country'] | order(name) {
    name,
    isWeedLegalHere
  }
`

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

export default function Browse({ params: { location = [] } }: BrowseProps) {
  const fadeInStyles = useFadeIn()
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const currentLocation = getCurrentLocationFromUrlParams(location)

  const { data } = useQuery<CMSCountry[]>({
    queryKey: ['country', currentLocation.country],
    queryFn: () =>
      currentLocation.country === DASH_PLACEHOLDER
        ? sanityFetch({ query: ALL_COUNTRIES_QUERY })
        : sanityFetch({
            query: COUNTRY_MATCH_QUERY,
            params: { country: currentLocation.country },
          }),
  })

  const transformedData = transformCMSDataToLegalityByCountry(data)

  const childLocationGroups = getChildLocationsFromLocation(
    currentLocation,
    transformedData
  )
  const legalityData = getLegalityDataForLocation(
    currentLocation,
    transformedData
  )

  const { heading, subHeading, ctaButtonText, ctaLinkUrl, backgroundColor } =
    getStringsForLegalityData(legalityData, currentLocation)

  useEffect(() => {
    setBackgroundColor(backgroundColor)
  }, [setBackgroundColor, backgroundColor])

  return (
    <main
      className={
        'mx-auto flex w-full max-w-screen-xl flex-grow flex-col items-center py-8 text-center md:py-14 ' +
        fadeInStyles
      }
    >
      <Breadcrumbs currentLocation={currentLocation} />
      <div className='flex flex-col items-center gap-6 py-24 text-center'>
        <Result
          heading={location.length === 0 ? 'Browse around the world.' : heading}
          headingSize={HeadingSizes.MEDIUM}
          subHeading={subHeading}
          ctaButtonText={ctaButtonText}
          ctaLinkUrl={ctaLinkUrl}
        />
      </div>
      {childLocationGroups.length > 0 && (
        <div className='my-8 flex w-full flex-col gap-16 md:mt-16'>
          {childLocationGroups.map(childLocationGroup => {
            const childLocationNames = Object.keys(childLocationGroup.data)

            if (childLocationNames.length === 0) return null

            return (
              <div key={childLocationGroup.key}>
                {childLocationGroup.label && (
                  <h3 className='text-left text-sm font-bold uppercase leading-6 tracking-wide'>
                    Browse by {childLocationGroup.label.singular}
                  </h3>
                )}
                <div className='mt-4 grid grid-cols-2 gap-x-4 gap-y-[10px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {childLocationNames.map(childLocationName => {
                    const childLocation = {
                      ...currentLocation,
                    }

                    if (childLocationGroup.key) {
                      childLocation[childLocationGroup.key] = childLocationName
                    }

                    return (
                      <Link
                        key={childLocationName}
                        href={getUrlFromCurrentLocation(
                          childLocation,
                          '/browse'
                        )}
                        className='flex min-h-[76px] items-center justify-center rounded-2xl border-2 border-brand-purple p-4 text-sm font-bold leading-tight text-brand-purple transition-colors hover:bg-white active:bg-gray-50 md:min-h-[92px] md:text-lg'
                      >
                        {childLocationName}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
