import getChildLocationsFromLocation from '@/app/helpers/getChildLocationGroupsFromLocation'
import { DASH_PLACEHOLDER } from '@/app/helpers/getUrlFromCurrentLocation'
import getCurrentLocationFromUrlParams from '@/app/helpers/getCurrentLocationFromUrlParams'
import getLegalityDataForLocation from '@/app/helpers/getLegalityDataForLocation'
import { sanityFetch } from '@/app/data/client'
import BrowseLocation from './BrowseLocation'
import { CMSCountry } from '@/app/types'

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

const LOCATION_COUNT_QUERY = `
  count(*[_type == 'IIHD_country' ||
    _type == 'IIHD_administrativeAreaLevel1' ||
    _type == 'IIHD_administrativeAreaLevel2' ||
    _type == 'IIHD_locality'])
`

export default async function BrowsePage({
  params: { location = [] },
}: BrowsePageProps) {
  const currentLocation = getCurrentLocationFromUrlParams(location)
  const isBrowseRootPage = currentLocation.country === DASH_PLACEHOLDER

  const [data, totalLocationCount] = await Promise.all([
    sanityFetch<CMSCountry[]>({
      query: isBrowseRootPage ? ALL_COUNTRIES_QUERY : COUNTRY_MATCH_QUERY,
      params: { country: currentLocation.country },
      tags: [
        'IIHD_country',
        'IIHD_administrativeAreaLevel1',
        'IIHD_administrativeAreaLevel2',
        'IIHD_locality',
      ],
    }),
    sanityFetch<number>({
      query: LOCATION_COUNT_QUERY,
      tags: [
        'IIHD_country',
        'IIHD_administrativeAreaLevel1',
        'IIHD_administrativeAreaLevel2',
        'IIHD_locality',
      ],
    }),
  ])

  const childLocationGroups = getChildLocationsFromLocation(
    currentLocation,
    data
  )
  const legalityData = getLegalityDataForLocation(currentLocation, data)

  return (
    <>
      <BrowseLocation
        currentLocation={currentLocation}
        legalityData={legalityData}
        childLocationGroups={childLocationGroups}
        totalLocationCount={totalLocationCount}
      />
    </>
  )
}
