'use client'

import dynamic from 'next/dynamic'

import { useContext, useEffect } from 'react'
import {
  BackgroundColor,
  SetBackgroundColorContext,
} from '@/app/contexts/backgroundColorContext'
import Heading from './components/Heading'
import LoadingSpinner from './components/LoadingSpinner'

const SearchInputs = dynamic(() => import('./components/SearchInputs'), {
  ssr: false,
  loading: ({ pastDelay }) =>
    pastDelay ? (
      <div className='h-[135px]'>
        <LoadingSpinner />
      </div>
    ) : null,
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
