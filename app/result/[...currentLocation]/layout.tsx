import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import { CurrentLocation } from '@/app/types'
import { Metadata, ResolvingMetadata } from 'next'

type GenerateMetadataProps = {
  params: {
    currentLocation: string[]
  }
}

export async function generateMetadata({
  params: { currentLocation },
}: GenerateMetadataProps): Promise<Metadata> {
  const partialCurrentLocation: CurrentLocation = {
    country: decodeURIComponent(currentLocation[0]),
    administrativeAreaLevel1:
      currentLocation[1] && decodeURIComponent(currentLocation[1]),
    administrativeAreaLevel2:
      currentLocation[2] && decodeURIComponent(currentLocation[2]),
    locality: currentLocation[3] && decodeURIComponent(currentLocation[3]),
    postalCode: currentLocation[4] && decodeURIComponent(currentLocation[4]),
  }

  const legalityData = getLegalityDataForLocation(partialCurrentLocation)

  const closestLocationName =
    legalityData?.closestMatchKey &&
    partialCurrentLocation[legalityData.closestMatchKey]

  return {
    title: `Is weed legal in ${decodeURIComponent(
      closestLocationName || 'your area'
    )}?`,
  }
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
