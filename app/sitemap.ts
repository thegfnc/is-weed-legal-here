import { MetadataRoute } from 'next'
import getCurrentLocationFromUrlParams from './helpers/getCurrentLocationFromUrlParams'
import getChildLocationsFromLocation from './helpers/getChildLocationGroupsFromLocation'
import getUrlFromCurrentLocation from './helpers/getUrlFromCurrentLocation'
import { CMSCountry, CurrentLocation } from './types'
import { sanityFetch } from './data/client'

const defaultPage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.isweedlegalhere.com',
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 1,
}

const browsePage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.isweedlegalhere.com/browse',
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 1,
}

const ALL_DATA_QUERY = `
  *[_type == 'IIHD_country'] | order(name) {
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

const enumerateLocationPages = (
  data: CMSCountry[],
  currentLocation: CurrentLocation,
  locationPageCollector: MetadataRoute.Sitemap
) => {
  const childLocationGroups = getChildLocationsFromLocation(
    currentLocation,
    data
  )

  for (const childLocationGroup of childLocationGroups) {
    for (const childLocationName of childLocationGroup.names) {
      const childLocation = {
        ...currentLocation,
      }

      if (childLocationGroup.key) {
        childLocation[childLocationGroup.key] = childLocationName
      }

      locationPageCollector.push({
        ...defaultPage,
        url: getUrlFromCurrentLocation(
          childLocation,
          'https://www.isweedlegalhere.com/browse'
        ),
        priority: 0.9,
      })

      if (childLocationGroup.key) {
        enumerateLocationPages(data, childLocation, locationPageCollector)
      }
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await sanityFetch<CMSCountry[]>({
    query: ALL_DATA_QUERY,
    tags: [
      'IIHD_country',
      'IIHD_administrativeAreaLevel1',
      'IIHD_administrativeAreaLevel2',
      'IIHD_locality',
    ],
  })

  const emptyCurrentLocation = getCurrentLocationFromUrlParams([])
  const locationPages: MetadataRoute.Sitemap = []

  await enumerateLocationPages(data, emptyCurrentLocation, locationPages)

  return [defaultPage, browsePage, ...locationPages]
}
