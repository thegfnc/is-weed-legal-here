'use client'

import Link from 'next/link'
import getUrlFromCurrentLocation from '@/app/helpers/getUrlFromCurrentLocation'
import Breadcrumbs from '@/app/components/Breadcrumbs'
import Result from '@/app/components/Result'
import useFadeIn from '@/app/hooks/useFadeIn'
import { ChildLocations } from '@/app/helpers/getChildLocationGroupsFromLocation'
import { CurrentLocation } from '@/app/types'
import { GetLegalityDataForLocationReturn } from '@/app/helpers/getLegalityDataForLocation'
import Heading, { HeadingSizes } from '@/app/components/Heading'

type BrowseLocationProps = {
  currentLocation: CurrentLocation
  legalityData: GetLegalityDataForLocationReturn | null
  childLocationGroups: ChildLocations[]
}

export default function BrowseLocation({
  currentLocation,
  legalityData,
  childLocationGroups,
}: BrowseLocationProps) {
  const fadeInStyles = useFadeIn()

  return (
    <main
      className={
        'mx-auto flex w-full max-w-screen-xl flex-grow flex-col items-center py-8 md:py-14 ' +
        fadeInStyles
      }
    >
      <Breadcrumbs currentLocation={currentLocation} />
      <div className='flex flex-col items-center px-20 pb-16 pt-[72px]'>
        <Result currentLocation={currentLocation} legalityData={legalityData} />
      </div>
      {childLocationGroups.length > 0 && (
        <div className='my-8 flex w-full flex-col gap-16 text-center md:mt-16'>
          {childLocationGroups.map(childLocationGroup => {
            if (!childLocationGroup.names.length) return null

            return (
              <div key={childLocationGroup.key}>
                {childLocationGroup.label && (
                  <h3 className='text-left text-sm font-bold uppercase leading-6 tracking-wide'>
                    Browse by {childLocationGroup.label.singular}
                  </h3>
                )}
                <div className='mt-4 grid grid-cols-2 gap-x-4 gap-y-[10px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
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
