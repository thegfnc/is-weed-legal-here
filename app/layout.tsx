import './styles/globals.css'

import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import PageWrapper from './components/PageWrapper'
import Header from './components/Header'
import Footer from './components/Footer'
import { Providers } from './providers'

type RootLayoutProps = {
  children: React.ReactNode
}

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export async function generateMetadata(): Promise<Metadata> {
  const pathname = '/'

  return {
    title: 'Is weed legal here?',
    description:
      'Learn about cannabis laws in locations worldwide. Stay up-to-date on the latest regulations and find resources for safe and legal consumption.',
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
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      url: pathname,
      type: 'website',
      locale: 'en_US',
    },
  }
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={spaceGrotesk.className}>
        <Providers>
          <PageWrapper>
            <Header />
            {children}
            <Footer />
          </PageWrapper>
        </Providers>
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
