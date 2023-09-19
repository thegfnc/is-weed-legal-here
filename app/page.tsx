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
      subHeading += ' and recreational uages is decriminalized.'
    } else if (currentStateData.DECRIMINALIZED === 'No') {
      subHeading += ' but recreational usage is not decriminalized.'
    }
  }

  return (
    <main className={`flex items-center justify-center w-screen h-screen ${bgColor} text-brand-purple transition-colors duration-500`}>
      <div className="flex flex-col items-center">
        <h1 className="text-[64px] leading-none">{heading}</h1>
        {!currentState && <FindOutButton setCurrentState={setCurrentState} />}
        {subHeading && <h2 className="text-[24px] mt-20">{subHeading}</h2>}
        {imageUrl && <Image
          src={imageUrl}
          width={imageHeight}
          height={imageWidth}
          className='mt-24'
          alt={imageAlt}
        />}
      </div>
    </main>
  )
}
