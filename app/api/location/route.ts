import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { geolocation } from '@vercel/edge'

export const runtime = 'edge'

export function GET(request: NextRequest) {
  console.log(process.env)
  // geolocation doesn't return any data during local development
  if (!process.env.VERCEL_ENV) {
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
  }

  const location = geolocation(request)

  // You can also get the city using dot notation on the function
  // const city = geolocation(request).city;
  return NextResponse.json(location, {
    status: 200,
  })
}
