import { Metadata, ResolvingMetadata } from 'next'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import transformCMSDataToLegalityByCountry, {
  CMSCountry,
} from '@/app/helpers/transformCMSDataToLegalityByCountry'
import { sanityFetch } from '@/app/data/client'

type GenerateMetadataProps = {
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
  { params: { location } }: GenerateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { openGraph } = await parent
  const pathname = '/search/' + location.join('/')

  const currentLocation = getCurrentLocationFromUrlParams(location)
  const data = await sanityFetch<CMSCountry[]>({
    query: COUNTRY_MATCH_QUERY,
    params: { country: currentLocation.country },
    tags: [
      'IIHD_country',
      'IIHD_administrativeAreaLevel1',
      'IIHD_administrativeAreaLevel2',
      'IIHD_locality',
    ],
  })
  const transformedData = transformCMSDataToLegalityByCountry(data)
  const legalityData = getLegalityDataForLocation(
    currentLocation,
    transformedData
  )

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

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
