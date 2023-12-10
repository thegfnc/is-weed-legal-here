import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { geolocation } from '@vercel/edge'

export const runtime = 'edge' // 'nodejs' is the default

export function GET(request: NextRequest) {
  const location = geolocation(request)
  // You can also get the city using dot notation on the function
  // const city = geolocation(request).city;
  return NextResponse.json(location, {
    status: 200,
  })
}
