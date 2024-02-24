import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import { Metadata, ResolvingMetadata } from 'next'

type GenerateMetadataParams = {
  params: {
    location: string[]
  }
}

export async function generateMetadata(
  { params: { location } }: GenerateMetadataParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { openGraph } = await parent
  const pathname = '/browse'

  const metadata: Metadata = {
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      ...openGraph,
      url: pathname,
    },
  }

  if (location) {
    const currentLocation = getCurrentLocationFromUrlParams(location)
    const legalityData = getLegalityDataForLocation(currentLocation)
    const closestLocationName =
      legalityData?.closestMatchKey &&
      currentLocation[legalityData.closestMatchKey]

    metadata.title = `Is weed legal in ${closestLocationName || 'your area'}?`

    if (metadata.alternates) {
      metadata.alternates.canonical += '/' + location.join('/')
    }

    if (metadata.openGraph) {
      metadata.openGraph.url += '/' + location.join('/')
    }
  }

  return metadata
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
