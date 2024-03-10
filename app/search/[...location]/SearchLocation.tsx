'use client'

import { GetLegalityDataForLocationReturn } from '@/app/helpers/getLegalityDataForLocation'
import Result from '@/app/components/Result'
import useFadeIn from '@/app/hooks/useFadeIn'
import { CurrentLocation } from '@/app/types'

type SearchLocationProps = {
  currentLocation: CurrentLocation
  legalityData: GetLegalityDataForLocationReturn | null
}

export default function SearchLocation({
  currentLocation,
  legalityData,
}: SearchLocationProps) {
  const fadeInStyles = useFadeIn()

  return (
    <main
      className={
        'mx-auto flex w-full max-w-[1120px] flex-grow flex-col items-center py-8 md:py-14 ' +
        fadeInStyles
      }
    >
      <div className='flex flex-col items-center pb-16 pt-[72px]'>
        <Result currentLocation={currentLocation} legalityData={legalityData} />
      </div>
    </main>
  )
}
