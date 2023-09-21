'use client'

import { useState } from 'react'
import Image from 'next/image'

import FindOutButton from './FindOutButton'

import marijuanaLegailtyByState from './marijuana-legailty-by-state'

export default function Home() {
  const [currentState, setCurrentState] = useState('' as string)

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
      className={`flex h-screen w-screen flex-col items-center justify-between ${bgColor} px-6 py-6 text-center text-brand-purple transition-colors duration-500 md:py-10`}
    >
      <h2
        className={`ease-out-expo text-[18px] font-bold leading-none transition-all duration-1000 ${
          currentState
            ? ' translate-y-0 opacity-100'
            : ' translate-y-16 opacity-0'
        }`}
      >
        Is weed legal here?
      </h2>
      <div className='flex flex-col items-center'>
        <h1 className='text-[48px] font-bold leading-none md:text-[64px]'>
          {heading}
        </h1>
        {!currentState && <FindOutButton setCurrentState={setCurrentState} />}
        {subHeading && (
          <h2 className='mt-12 max-w-xl text-[20px] md:mt-20 md:text-[26px]'>
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
      </div>
      <div className='flex gap-2 text-[14px]'>
        <span>Copyright &copy; {new Date().getFullYear()}</span>
        <span>·</span>
        <a href='https://www.thegoodfornothings.club/' target='_blank'>
          The Good for Nothings Club
        </a>
      </div>
    </main>
  )
}
