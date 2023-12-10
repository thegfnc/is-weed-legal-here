import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { geolocation } from '@vercel/edge'

export const runtime = 'edge'

export function GET(request: NextRequest) {
  // geolocation doesn't return any data during local development
  // use the following locations to test the different states
  if (!process.env.VERCEL_ENV) {
    ////////////////////////////////////////
    // MEDICINAL: LegalStatus.Legal,
    // RECREATIONAL: LegalStatus.Legal,
    // QUANTITY: null,
    // return NextResponse.json(
    //   {
    //     city: 'San Francisco',
    //     country: 'US',
    //     flag: '🇺🇸',
    //     countryRegion: 'CA',
    //     region: 'cle1',
    //     latitude: '37.7749',
    //     longitude: '-122.4194',
    //   },
    //   {
    //     status: 200,
    //   }
    // )
    ////////////////////////////////////////
    // MEDICINAL: LegalStatus.Illegal,
    // RECREATIONAL: LegalStatus.Decriminalized,
    // QUANTITY: '2 ounces',
    return NextResponse.json(
      {
        city: 'Austin',
        country: 'US',
        flag: '🇺🇸',
        countryRegion: 'TX',
        region: 'cle1',
        latitude: '30.2423',
        longitude: '-97.7672',
      },
      {
        status: 200,
      }
    )
    ////////////////////////////////////////
    // MEDICINAL: LegalStatus.Illegal,
    // RECREATIONAL: LegalStatus.Illegal,
    // QUANTITY: null,
    // return NextResponse.json(
    //   {
    //     city: 'Nashville',
    //     country: 'US',
    //     flag: '🇺🇸',
    //     countryRegion: 'TN',
    //     region: 'cle1',
    //     latitude: '36.1627',
    //     longitude: '-86.7816',
    //   },
    //   {
    //     status: 200,
    //   }
    // )
  }

  const location = geolocation(request)

  // You can also get the city using dot notation on the function
  // const city = geolocation(request).city;
  return NextResponse.json(location, {
    status: 200,
  })
}
