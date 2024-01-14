'use client'

import { useContext, useEffect } from 'react'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import { CurrentLocation } from '@/app/types'
import getChildLocationsFromLocation from '@/app/helpers/getChildLocationsFromLocation'
import Link from 'next/link'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '@/app/helpers/getUrlFromCurrentLocation'

type BrowseProps = {
  params: {
    location: string[]
  }
}

export default function Browse({ params: { location = [] } }: BrowseProps) {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const partialCurrentLocation: CurrentLocation = {
    country: decodeURIComponent(location[0] || DASH_PLACEHOLDER),
    administrativeAreaLevel1: decodeURIComponent(
      location[1] || DASH_PLACEHOLDER
    ),
    administrativeAreaLevel2: decodeURIComponent(
      location[2] || DASH_PLACEHOLDER
    ),
    locality: decodeURIComponent(location[3] || DASH_PLACEHOLDER),
    postalCode: decodeURIComponent(location[4] || DASH_PLACEHOLDER),
  }

  const childLocationGroups = getChildLocationsFromLocation(
    partialCurrentLocation
  )

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
              ...partialCurrentLocation,
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
