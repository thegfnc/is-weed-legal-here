'use client'

import Breadcrumbs from '@/app/components/Breadcrumbs'
import Result from '@/app/components/Result'
import useFadeIn from '@/app/hooks/useFadeIn'
import { ChildLocationGroup } from '@/app/helpers/getChildLocationGroupsFromLocation'
import { CurrentLocation } from '@/app/types'
import { GetLegalityDataForLocationReturn } from '@/app/helpers/getLegalityDataForLocation'
import ChildLocations from '@/app/components/ChildLocations'

type BrowseLocationProps = {
  currentLocation: CurrentLocation
  legalityData: GetLegalityDataForLocationReturn | null
  childLocationGroups: ChildLocationGroup[]
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
        'mx-auto flex w-full max-w-[1120px] flex-grow flex-col items-center py-8 md:py-14 ' +
        fadeInStyles
      }
    >
      <Breadcrumbs currentLocation={currentLocation} />
      <div className='flex flex-col items-center pb-16 pt-[72px]'>
        <Result currentLocation={currentLocation} legalityData={legalityData} />
      </div>
      <div className='my-8 w-full md:mt-16'>
        <ChildLocations
          currentLocation={currentLocation}
          childLocationGroups={childLocationGroups}
        />
      </div>
    </main>
  )
}
