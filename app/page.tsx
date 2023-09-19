'use client'

import { useState } from 'react'
import FindOutButton from './FindOutButton'

import marijuanaLegailtyByState from './marijuana-legailty-by-state.json'

export default function Home() {
  const [currentState, setCurrentState] = useState('' as string)

  const currentStateData = marijuanaLegailtyByState[currentState] || {}

  let headline = 'Is weed legal here?'
  let bgColor = 'bg-brand-yellow'

  if (currentStateData.LEGAL_STATUS === 'Fully Legal') {
    headline = `Yes! Weed is legal in ${currentState}`
    bgColor = 'bg-brand-green'
  } else if (currentStateData.LEGAL_STATUS === 'Fully Illegal') {
    headline = `No! Weed is illegal in ${currentState}`
    bgColor = 'bg-brand-red'
  } else if (currentStateData.LEGAL_STATUS === 'Mixed') {
    headline = `Sort of! Weed is partially legal in ${currentState}`
    bgColor = 'bg-brand-yellow'
  }

  return (
    <main className={`flex items-center justify-center w-screen h-screen ${bgColor} text-brand-purple`}>
      <div className="flex flex-col items-center">
        <h1 className="text-[64px]">{headline}</h1>
        <FindOutButton setCurrentState={setCurrentState} />
      </div>
    </main>
  )
}
