import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Is weed legal here?',
  description:
    'Find out if weed is legal in your state using your current location.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={spaceGrotesk.className}>
        {children}
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
