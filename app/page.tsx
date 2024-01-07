'use client'

import dynamic from 'next/dynamic'

import { useContext } from 'react'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import Heading from './components/Heading'

import getStringsForLegalityData from './helpers/getStringsForLegalityData'

const BrowserLocation = dynamic(() => import('./components/BrowserLocation'), {
  ssr: false,
})

export default function Home() {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  const { heading } = getStringsForLegalityData(null, null)

  setBackgroundColor(BackgroundColor.YELLOW)

  return (
    <main className='flex flex-col items-center py-24 text-center'>
      <Heading text={heading} />
      <BrowserLocation />
    </main>
  )
}
