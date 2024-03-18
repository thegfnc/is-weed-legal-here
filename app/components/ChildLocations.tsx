import Link from 'next/link'
import { ChildLocationGroup } from '../helpers/getChildLocationGroupsFromLocation'
import { CurrentLocation } from '../types'
import getUrlFromCurrentLocation from '../helpers/getUrlFromCurrentLocation'

type ChildLocationsProps = {
  currentLocation: CurrentLocation
  childLocationGroups: ChildLocationGroup[]
}

export default function ChildLocations({
  currentLocation,
  childLocationGroups,
}: ChildLocationsProps) {
  return childLocationGroups.length > 0 ? (
    <div className='flex w-full flex-col gap-16'>
      {childLocationGroups.map(childLocationGroup => {
        if (!childLocationGroup.names.length) return null

        return (
          <div key={childLocationGroup.key}>
            <h3 className='text-left text-sm font-bold uppercase leading-6 tracking-wide'>
              Browse by {childLocationGroup.label.singular}
            </h3>
            <div className='mt-4 grid grid-cols-2 gap-x-4 gap-y-[10px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {childLocationGroup.names.map(childLocationName => {
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
                    className='flex min-h-[76px] items-center justify-center rounded-2xl border-2 border-brand-purple p-4 text-center text-sm font-bold leading-tight text-brand-purple transition-colors hover:bg-white active:bg-gray-50 md:min-h-[92px] md:text-base'
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
  ) : null
}
