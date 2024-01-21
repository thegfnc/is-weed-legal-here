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

  useEffect(() => {
    setBackgroundColor(BackgroundColor.YELLOW)
  }, [setBackgroundColor])

  return (
    <main className='mx-auto flex max-w-screen-xl flex-col items-center py-24 text-center'>
      <Breadcrumbs currentLocation={currentLocation} />
      {legalityData && legalityData.closestMatchKey && (
        <pre className='mt-14 flex max-w-md flex-col items-center rounded-lg bg-black/5 p-6 text-left text-[12px] leading-4 transition-opacity'>
          {JSON.stringify(legalityData[legalityData.closestMatchKey], null, 2)}
        </pre>
      )}
      {childLocationGroups.map(childLocationGroup => {
        const childLocationNames = Object.keys(childLocationGroup.data)

        return (
          <div
            key={childLocationGroup.key}
            className='mt-16 grid w-full grid-cols-5 gap-x-4 gap-y-[10px]'
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
