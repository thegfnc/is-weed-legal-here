'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

import Header from './components/Header'
import Footer from './components/Footer'
import MainImage, { MainImageType } from './components/MainImage'
import SubHeading from './components/SubHeading'
import Heading from './components/Heading'
import CallToActionButton from './components/CallToActionButton'

import getLegalityDataForLocation from './helpers/getLegalityDataForLocation'
import getStringsForLegalityData from './helpers/getStringsForLegalityData'
import { CurrentLocation } from './types'

const BrowserLocation = dynamic(() => import('./components/BrowserLocation'), {
  ssr: false,
})

export default function Home() {
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null)

  const legalityData = getLegalityDataForLocation(currentLocation)
  const { bgColor, heading, subHeading, imageType, ctaLinkUrl, ctaButtonText } =
    getStringsForLegalityData(legalityData, currentLocation)

  return (
    <>
      <div
        className={`flex min-h-[100dvh] w-screen flex-col items-center justify-between ${bgColor} px-6 py-6 text-center text-brand-purple transition-colors duration-500 md:py-10`}
      >
        <Header isVisible={Boolean(currentLocation)} />
        <main className='flex flex-col items-center py-24'>
          <Heading text={heading} />
          {!currentLocation && (
            <BrowserLocation
              currentLocation={currentLocation}
              setCurrentLocation={setCurrentLocation}
            />
          )}
          {subHeading && <SubHeading text={subHeading} />}
          {imageType && <MainImage type={imageType} />}
          {ctaLinkUrl && (
            <CallToActionButton text={ctaButtonText} linkUrl={ctaLinkUrl} />
          )}
        </main>
        <Footer
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
        />
      </div>
    </>
  )
}
