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
      className={`flex h-screen w-screen items-center justify-center ${bgColor} p-6 text-center text-brand-purple transition-colors duration-500`}
    >
      <div className='flex flex-col items-center'>
        <h1 className='text-[48px] leading-none md:text-[64px]'>{heading}</h1>
        {!currentState && <FindOutButton setCurrentState={setCurrentState} />}
        {subHeading && (
          <h2 className='mt-20 max-w-xl text-[20px] md:text-[26px]'>
            {subHeading}
          </h2>
        )}
        {imageUrl && (
          <Image
            src={imageUrl}
            width={imageHeight}
            height={imageWidth}
            className='mt-24'
            alt={imageAlt}
          />
        )}
      </div>
    </main>
  )
}
