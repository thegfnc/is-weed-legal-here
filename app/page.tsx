'use client'

import { useState } from 'react'
import Image from 'next/image'

import FindOutButton from './FindOutButton'

import marijuanaLegailtyByState from './marijuana-legailty-by-state.json'

export default function Home() {
  const [currentState, setCurrentState] = useState('' as string)

  const currentStateData = marijuanaLegailtyByState[currentState] || {}

  let heading = 'Is weed legal here?'
  let bgColor = 'bg-brand-yellow'
  let subHeading = ''
  let imageUrl = null

  if (currentStateData.LEGAL_STATUS === 'Fully Legal') {
    heading = `Yes! Weed is legal in ${currentState}`
    bgColor = 'bg-brand-green'
    imageUrl = '/weed.png'
  } else if (currentStateData.LEGAL_STATUS === 'Fully Illegal') {
    heading = `No! Weed is illegal in ${currentState}`
    bgColor = 'bg-brand-red'
    imageUrl = '/police.png'
  } else if (currentStateData.LEGAL_STATUS === 'Mixed') {
    heading = `Sort of! Weed is partially legal in ${currentState}`
    bgColor = 'bg-brand-yellow'

    if (currentStateData.MEDICINAL === 'Yes') {
      subHeading = 'Medical marijuana is legal'
    } else if (currentStateData.MEDICINAL.startsWith('CBD Oil Only')) {
      subHeading = 'CBD oil only is legal for medical purposes'
    }

    if (currentStateData.DECRIMINALIZED === 'Yes') {
      subHeading += ' and recreational is decriminalized.'
    } else if (currentStateData.DECRIMINALIZED === 'No') {
      subHeading += ' but recreational is not decriminalized.'
    }
  }

  return (
    <main className={`flex items-center justify-center w-screen h-screen ${bgColor} text-brand-purple`}>
      <div className="flex flex-col items-center">
        <h1 className="text-[64px] leading-none">{heading}</h1>
        {!currentState && <FindOutButton setCurrentState={setCurrentState} />}
        {subHeading && <h2 className="text-[24px] mt-20">{subHeading}</h2>}
        {imageUrl && <Image
          src="/weed.png"
          width="240"
          height="240"
          className='mt-24'
        />}
      </div>
    </main>
  )
}
