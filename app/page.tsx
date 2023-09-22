'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MdSearch } from 'react-icons/md'

import FindOutButton from './FindOutButton'

import marijuanaLegailtyByState from './marijuana-legailty-by-state'
import Link from 'next/link'

export default function Home() {
  const [currentState, setCurrentState] = useState('' as string)
  const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null)

  const currentStateData = marijuanaLegailtyByState[currentState] || {}

  let heading = 'Is weed legal here?'
  let bgColor = 'bg-brand-yellow'
  let subHeading = ''
  let imageUrl = ''
  let imageHeight = 0
  let imageWidth = 0
  let imageAlt = ''

  if (currentStateData.LEGAL_STATUS === 'Fully Legal') {
    heading = `Yes! Weed is legal in ${currentState}`
    bgColor = 'bg-brand-green'
    imageUrl = '/weed.png'
    imageHeight = 240
    imageWidth = 240
    imageAlt = 'Stoned marijuana leaf cartoon'
  } else if (currentStateData.LEGAL_STATUS === 'Fully Illegal') {
    heading = `No! Weed is illegal in ${currentState}`
    bgColor = 'bg-brand-red'
    imageUrl = '/police.png'
    imageHeight = 321
    imageWidth = 240
    imageAlt = 'Police car seen from rearview mirror'
  } else if (currentStateData.LEGAL_STATUS === 'Mixed') {
    heading = `Sort of! Weed is partially legal in ${currentState}`
    bgColor = 'bg-brand-yellow'

    if (currentStateData.MEDICINAL === 'Yes') {
      subHeading = 'Medical marijuana is legal'
    } else if (currentStateData.MEDICINAL?.startsWith('CBD Oil Only')) {
      subHeading = 'CBD oil only is legal for medical purposes'
    }

    if (currentStateData.DECRIMINALIZED === 'Yes') {
      subHeading += ' and recreational usage is decriminalized.'
    } else if (currentStateData.DECRIMINALIZED === 'No') {
      subHeading += ' but recreational usage is not decriminalized.'
    }
  } else if (currentState && !currentStateData.LEGAL_STATUS) {
    heading = `Sorry! We don't know if weed is legal in ${currentState} yet`
  }

  return (
    <main
      className={`flex min-h-[100dvh] w-screen flex-col items-center justify-between ${bgColor} px-6 py-6 text-center text-brand-purple transition-colors duration-500 md:py-10`}
    >
      <Link
        href='/'
        className={`ease-out-expo text-[18px] font-bold leading-none transition-all duration-1000 ${
          currentState
            ? ' translate-y-0 opacity-100'
            : ' translate-y-16 opacity-0'
        }`}
      >
        Is weed legal here?
      </Link>
      <div className='flex flex-col items-center py-14'>
        <h1 className='text-[48px] font-bold leading-none md:text-[64px]'>
          {heading}
        </h1>
        {!currentState && (
          <FindOutButton
            setCurrentState={setCurrentState}
            setGoogleMapsLink={setGoogleMapsLink}
          />
        )}
        {subHeading && (
          <h2 className='mt-12 max-w-xl text-[20px] md:mt-12 md:text-[26px]'>
            {subHeading}
          </h2>
        )}
        {imageUrl && (
          <Image
            src={imageUrl}
            width={imageHeight}
            height={imageWidth}
            className='mt-12 md:mt-24'
            alt={imageAlt}
          />
        )}
        {googleMapsLink &&
          currentStateData.LEGAL_STATUS !== 'Fully Illegal' && (
            <a
              className='mt-12 flex items-center rounded-full border-2 border-brand-purple py-2 pl-4 pr-5 text-[16px] transition-colors hover:bg-brand-purple hover:text-brand-yellow md:mt-20 md:text-[18px]'
              href={googleMapsLink}
              target='_blank'
            >
              <MdSearch size='24px' className='mr-3' /> Find Dispensaries Near
              You
            </a>
          )}
      </div>
      <div className='flex gap-2 text-[14px]'>
        <span>Copyright &copy; {new Date().getFullYear()}</span>
        <span>·</span>
        <a
          href='https://www.thegoodfornothings.club/'
          target='_blank'
          className='underline-offset-2 hover:underline'
        >
          The Good for Nothings Club
        </a>
      </div>
    </main>
  )
}
