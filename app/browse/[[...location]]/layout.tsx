import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import { Metadata } from 'next'

type GenerateMetadataProps = {
  params: {
    location: string[]
  }
}

export async function generateMetadata({
  params: { location },
}: GenerateMetadataProps): Promise<Metadata> {
  if (!location) return {}

  const currentLocation = getCurrentLocationFromUrlParams(location)
  const legalityData = getLegalityDataForLocation(currentLocation)

  const closestLocationName =
    legalityData?.closestMatchKey &&
    currentLocation[legalityData.closestMatchKey]

  return {
    title: `Is weed legal in ${closestLocationName || 'your area'}?`,
  }
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
