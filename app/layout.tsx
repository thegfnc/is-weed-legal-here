import './styles/globals.css'

import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import PageWrapper from './components/PageWrapper'
import Header from './components/Header'
import Footer from './components/Footer'

type RootLayoutProps = {
  children: React.ReactNode
}

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Is weed legal here?',
  description: 'Find out if weed is legal near you by searching a location.',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'weed',
    'cannabis',
    'marijuana',
    'legal',
    'state',
    'usa',
    'CBD',
    'THC',
    'medical',
    'recreational',
    'decriminalized',
    'legalized',
    'legalization',
    'legalised',
    'legalisation',
    'legalize',
    'legalise',
  ],
  creator: 'The Good for Nothings Club',
  metadataBase: new URL('https://www.isweedlegalhere.com'),
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={spaceGrotesk.className}>
        <PageWrapper>
          <Header />
          {children}
          <Footer />
        </PageWrapper>
        <Analytics />
        <Script src='https://www.googletagmanager.com/gtag/js?id=G-3MCRMXW804' />
        <Script id='google-analytics'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3MCRMXW804');
          `}
        </Script>
      </body>
    </html>
  )
}
