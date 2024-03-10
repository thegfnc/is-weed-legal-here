import { TypedObject } from '@portabletext/types'

import MainImage from '@/app/components/MainImage'
import SubHeading from '@/app/components/SubHeading'
import Heading from '@/app/components/Heading'
import CallToActionButton from '@/app/components/CallToActionButton'
import { MainImageType } from '../data/images'
import Overview from './Overview'
import LegalityStatusTable from './LegalityStatusTable'
import RelatedLocationsList from './RelatedLocationsList'
import SponsoredBy from './SponsoredBy'
import { CurrentLocation } from '../types'
import { GetLegalityDataForLocationReturn } from '../helpers/getLegalityDataForLocation'
import { DASH_PLACEHOLDER } from '../helpers/getUrlFromCurrentLocation'
import getStringsForLegalityData from '../helpers/getStringsForLegalityData'
import { useContext, useEffect } from 'react'
import { SetBackgroundColorContext } from '../contexts/backgroundColorContext'

type ResultProps = {
  currentLocation: CurrentLocation
  legalityData: GetLegalityDataForLocationReturn | null
}

export default function Result({ currentLocation, legalityData }: ResultProps) {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const {
    heading,
    subHeading,
    ctaButtonText,
    ctaLinkUrl,
    backgroundColor,
    imageType,
    overview,
  } = getStringsForLegalityData(legalityData, currentLocation)

  useEffect(() => {
    setBackgroundColor(backgroundColor)
  }, [setBackgroundColor, backgroundColor])

  return (
    <>
      <div className='flex flex-col items-center gap-6 text-center'>
        <Heading
          text={
            currentLocation.country === DASH_PLACEHOLDER
              ? 'Browse around the world.'
              : heading
          }
        />
        {subHeading && (
          <div>
            <SubHeading text={subHeading} />
          </div>
        )}
        {imageType && <MainImage type={imageType} />}
        {ctaButtonText && ctaLinkUrl && (
          <CallToActionButton text={ctaButtonText} linkUrl={ctaLinkUrl} />
        )}
      </div>
      {legalityData && overview && (
        <div className='mt-[96px] grid grid-cols-1 gap-14 border-t-2 border-brand-purple pt-16 md:grid-cols-3 lg:gap-[120px]'>
          <div className='md:col-span-2'>
            {overview && <Overview body={overview} />}
            <div className='mt-16 border-t-2 border-brand-purple pt-16'>
              <LegalityStatusTable legalityData={legalityData} />
            </div>
          </div>
          <div className='flex flex-col gap-8'>
            <RelatedLocationsList currentLocation={currentLocation} />
            <SponsoredBy />
          </div>
        </div>
      )}
    </>
  )
}
