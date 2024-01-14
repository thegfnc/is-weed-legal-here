'use client'

import { useState } from 'react'
import {
  BackgroundColor,
  BackgroundColorContext,
  SetBackgroundColorContext,
} from '../contexts/backgroundColorContext'

type PageWrapperProps = {
  children: React.ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const [backgroundColor, setBackgroundColor] = useState(BackgroundColor.YELLOW)

  return (
    <BackgroundColorContext.Provider value={backgroundColor}>
      <SetBackgroundColorContext.Provider value={setBackgroundColor}>
        <div
          className={`flex min-h-[100dvh] w-screen flex-col justify-between ${backgroundColor} px-6 py-6 text-brand-purple transition-colors duration-500 md:py-10`}
        >
          {children}
        </div>
      </SetBackgroundColorContext.Provider>
    </BackgroundColorContext.Provider>
  )
}
