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

type BrowseProps = {
  params: {
    location: string[]
  }
}

export default function Browse({ params: { location = [] } }: BrowseProps) {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const currentLocation = getCurrentLocationFromUrlParams(location)
  const childLocationGroups = getChildLocationsFromLocation(currentLocation)

  useEffect(() => {
    setBackgroundColor(BackgroundColor.YELLOW)
  }, [setBackgroundColor])

  return (
    <main className='flex flex-col items-center py-24 text-center'>
      {location.map(locationPart => locationPart + ' / ')}
      {childLocationGroups.length &&
        childLocationGroups.map(childLocations =>
          Object.keys(childLocations.data).map(childLocation => {
            const location = {
              ...currentLocation,
            }

            if (childLocations.key) {
              location[childLocations.key] = childLocation
            }

            return (
              <Link
                key={childLocation}
                href={getUrlFromCurrentLocation(location, '/browse')}
              >
                {childLocation}
              </Link>
            )
          })
        )}
    </main>
  )
}
