'use client'

import dynamic from 'next/dynamic'

import Heading from './components/Heading'

import getStringsForLegalityData from './helpers/getStringsForLegalityData'

const BrowserLocation = dynamic(() => import('./components/BrowserLocation'), {
  ssr: false,
})

export default function Home() {
  const { bgColor, heading } = getStringsForLegalityData(null, null)

  return (
    <main className='flex flex-col items-center py-24'>
      <Heading text={heading} />
      <BrowserLocation />
    </main>
  )
}
