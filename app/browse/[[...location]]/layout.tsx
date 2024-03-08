import { sanityFetch } from '@/app/data/client'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import transformCMSDataToLegalityByCountry, {
  CMSCountry,
} from '@/app/helpers/transformCMSDataToLegalityByCountry'
import { Metadata, ResolvingMetadata } from 'next'

type GenerateMetadataParams = {
  params: {
    location: string[]
  }
}

const COUNTRY_MATCH_QUERY = `
  *[_type == 'IIHD_country' && name == $country] | order(name) {
    name,
    isWeedLegalHere,
    labels,
    administrativeAreaLevel1 {
      children[]-> {
        name,
        isWeedLegalHere,
        administrativeAreaLevel2 {
          children[]-> {
            name,
            isWeedLegalHere
          }
        },
        locality {
          children[]-> {
            name,
            isWeedLegalHere
          }
        }
      }
    }
  }
`

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
    const data = await sanityFetch<CMSCountry[]>({
      query: COUNTRY_MATCH_QUERY,
      params: { country: currentLocation.country },
    })
    const transformedData = transformCMSDataToLegalityByCountry(data)
    const legalityData = getLegalityDataForLocation(
      currentLocation,
      transformedData
    )

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

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
