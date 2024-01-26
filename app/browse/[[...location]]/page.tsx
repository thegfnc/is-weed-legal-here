'use client'

import { useContext, useEffect } from 'react'
import Link from 'next/link'
import { SetBackgroundColorContext } from '@/app/contexts/backgroundColorContext'
import getChildLocationsFromLocation from '@/app/helpers/getChildLocationGroupsFromLocation'
import getUrlFromCurrentLocation from '@/app/helpers/getUrlFromCurrentLocation'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import { HeadingSizes } from '@/app/components/Heading'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import Result from '@/app/components/Result'

type BrowseProps = {
  params: {
    location: string[]
  }
}

export default function Browse({ params: { location = [] } }: BrowseProps) {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const currentLocation = getCurrentLocationFromUrlParams(location)
  const childLocationGroups = getChildLocationsFromLocation(currentLocation)
  const legalityData = getLegalityDataForLocation(currentLocation)

  const { heading, subHeading, ctaButtonText, ctaLinkUrl, backgroundColor } =
    getStringsForLegalityData(legalityData, currentLocation)

  useEffect(() => {
    setBackgroundColor(backgroundColor)
  }, [setBackgroundColor, backgroundColor])

  return (
    <main className='mx-auto flex w-full max-w-screen-xl flex-grow flex-col items-center py-8 text-center md:py-14'>
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
      {childLocationGroups.map(childLocationGroup => {
        const childLocationNames = Object.keys(childLocationGroup.data)

        return (
          <div
            key={childLocationGroup.key}
            className='mt-8 grid w-full grid-cols-2 gap-x-4 gap-y-[10px] md:mt-16 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          >
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
                  href={getUrlFromCurrentLocation(childLocation, '/browse')}
                  className='flex min-h-[76px] items-center justify-center rounded-2xl border-2 border-brand-purple p-4 text-sm font-bold leading-tight text-brand-purple transition-colors hover:bg-white active:bg-gray-50 md:min-h-[92px] md:text-lg'
                >
                  {childLocationName}
                </Link>
              )
            })}
          </div>
        )
      })}
    </main>
  )
}
