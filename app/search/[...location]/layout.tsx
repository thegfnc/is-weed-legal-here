import { Metadata, ResolvingMetadata } from 'next'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'

type GenerateMetadataProps = {
  params: {
    location: string[]
  }
}

export async function generateMetadata(
  { params: { location } }: GenerateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { openGraph } = await parent
  const pathname = '/search/' + location.join('/')

  const currentLocation = getCurrentLocationFromUrlParams(location)
  const legalityData = getLegalityDataForLocation(currentLocation)

  const closestLocationName =
    legalityData?.closestMatchKey &&
    currentLocation[legalityData.closestMatchKey]

  return {
    title: `Is weed legal in ${closestLocationName || 'your area'}?`,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      ...openGraph,
      url: pathname,
    },
  }
}

export default function SearchResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
