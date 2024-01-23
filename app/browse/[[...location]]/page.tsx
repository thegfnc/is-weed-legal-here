'use client'

import { useContext, useEffect } from 'react'
import Link from 'next/link'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import getChildLocationsFromLocation from '@/app/helpers/getChildLocationGroupsFromLocation'
import getUrlFromCurrentLocation from '@/app/helpers/getUrlFromCurrentLocation'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import Heading, { HeadingSizes } from '@/app/components/Heading'
import getStringsForLegalityData from '@/app/helpers/getStringsForLegalityData'
import SubHeading from '@/app/components/SubHeading'

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

  const { heading, subHeading, backgroundColor } = getStringsForLegalityData(
    legalityData,
    currentLocation
  )

  useEffect(() => {
    setBackgroundColor(backgroundColor || BackgroundColor.YELLOW)
  }, [setBackgroundColor, backgroundColor])

  return (
    <main className='mx-auto flex w-full max-w-screen-xl flex-grow flex-col items-center py-14 text-center'>
      <Breadcrumbs currentLocation={currentLocation} />
      <div className='mt-4'>
        <Heading
          text={`Browse around ${(legalityData?.closestMatchKey && currentLocation[legalityData.closestMatchKey]) || 'the world'}.`}
          size={HeadingSizes.MEDIUM}
        />
      </div>
      {legalityData && legalityData.closestMatchKey && (
        <>
          <div className='mt-32 max-w-6xl'>
            <Heading text={heading} size={HeadingSizes.SMALL} />
          </div>
          <div className='mb-20 mt-2'>
            {subHeading && <SubHeading text={subHeading} />}
          </div>
        </>
      )}
      {childLocationGroups.map(childLocationGroup => {
        const childLocationNames = Object.keys(childLocationGroup.data)

        return (
          <div
            key={childLocationGroup.key}
            className='mt-20 grid w-full grid-cols-2 gap-x-4 gap-y-[10px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
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
                  className='flex min-h-[92px] items-center justify-center rounded-2xl border-2 border-brand-purple p-4 text-lg font-bold leading-tight text-brand-purple transition-colors hover:bg-white'
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
