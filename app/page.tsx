'use client'

import dynamic from 'next/dynamic'

import Footer from './components/Footer'
import Heading from './components/Heading'

import getStringsForLegalityData from './helpers/getStringsForLegalityData'

const BrowserLocation = dynamic(() => import('./components/BrowserLocation'), {
  ssr: false,
})

export default function Home() {
  const { bgColor, heading } = getStringsForLegalityData(null, null)

  return (
    <>
      <div
        className={`flex min-h-[100dvh] w-screen flex-col items-center justify-between ${bgColor} px-6 py-6 text-center text-brand-purple transition-colors duration-500 md:py-10`}
      >
        <div></div> {/* Need this for spacing */}
        <main className='flex flex-col items-center py-24'>
          <Heading text={heading} />
          <BrowserLocation />
        </main>
        <Footer />
      </div>
    </>
  )
}
