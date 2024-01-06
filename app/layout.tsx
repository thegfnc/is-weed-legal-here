import './styles/globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Is weed legal here?',
  description:
    'Find out if weed is legal in your state using your current location.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bgColor = 'bg-brand-yellow'

  return (
    <html lang='en'>
      <body className={spaceGrotesk.className}>
        <div
          className={`flex min-h-[100dvh] w-screen flex-col items-center justify-between ${bgColor} px-6 py-6 text-center text-brand-purple transition-colors duration-500 md:py-10`}
        >
          <Header />
          {children}
          <Footer />
        </div>
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
