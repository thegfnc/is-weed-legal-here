import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import transformCMSDataToLegalityByCountry, {
  CMSCountry,
} from '@/app/helpers/transformCMSDataToLegalityByCountry'
import { sanityFetch } from '@/app/data/client'
import SearchLocation from './SearchLocation'

type SearchPageProps = {
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

export default async function SearchPage({
  params: { location },
}: SearchPageProps) {
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

  return (
    <SearchLocation
      currentLocation={currentLocation}
      legalityData={legalityData}
    />
  )
}
