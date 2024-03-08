import getChildLocationsFromLocation from '@/app/helpers/getChildLocationGroupsFromLocation'
import { DASH_PLACEHOLDER } from '@/app/helpers/getUrlFromCurrentLocation'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import { sanityFetch } from '@/app/data/client'
import transformCMSDataToLegalityByCountry, {
  CMSCountry,
} from '@/app/helpers/transformCMSDataToLegalityByCountry'
import BrowseLocation from './BrowseLocation'

type BrowsePageProps = {
  params: {
    location: string[]
  }
}

const ALL_COUNTRIES_QUERY = `
  *[_type == 'IIHD_country'] | order(name) {
    name,
    isWeedLegalHere
  }
`

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

export default async function BrowsePage({
  params: { location = [] },
}: BrowsePageProps) {
  const currentLocation = getCurrentLocationFromUrlParams(location)

  const data = await sanityFetch<CMSCountry[]>({
    query:
      currentLocation.country === DASH_PLACEHOLDER
        ? ALL_COUNTRIES_QUERY
        : COUNTRY_MATCH_QUERY,
    params: { country: currentLocation.country },
  })

  const transformedData = transformCMSDataToLegalityByCountry(data)

  const childLocationGroups = getChildLocationsFromLocation(
    currentLocation,
    transformedData
  )
  const legalityData = getLegalityDataForLocation(
    currentLocation,
    transformedData
  )

  return (
    <BrowseLocation
      currentLocation={currentLocation}
      legalityData={legalityData}
      childLocationGroups={childLocationGroups}
    />
  )
}
