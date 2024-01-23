'use client'

import dynamic from 'next/dynamic'

import { useContext, useEffect } from 'react'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import Heading from './components/Heading'

const SearchInputs = dynamic(() => import('./components/SearchInputs'), {
  ssr: false,
})

export default function Home() {
  const setBackgroundColor = useContext(SetBackgroundColorContext)

  useEffect(() => {
    setBackgroundColor(BackgroundColor.YELLOW)
  }, [setBackgroundColor])

  return (
    <main className='flex flex-col gap-8 py-24 text-center'>
      <Heading text={'Is weed legal here?'} />
      <SearchInputs />
    </main>
  )
}
