import { MetadataRoute } from 'next'
import getCurrentLocationFromUrlParams from './helpers/getCurrentLocationFromUrlParams'
import getChildLocationsFromLocation from './helpers/getChildLocationGroupsFromLocation'
import getUrlFromCurrentLocation from './helpers/getUrlFromCurrentLocation'
import { CurrentLocation } from './types'

const defaultPage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.isweedlegalhere.com',
  lastModified: new Date(),
  changeFrequency: 'monthly',
  priority: 1,
}

const enumerateBrowseLocations = (
  currentLocation: CurrentLocation,
  pageCollector: MetadataRoute.Sitemap = []
) => {
  getChildLocationsFromLocation(currentLocation).forEach(childLocationGroup => {
    Object.keys(childLocationGroup.data).forEach(childLocationName => {
      const childLocation = {
        ...currentLocation,
      }

      if (childLocationGroup.key) {
        childLocation[childLocationGroup.key] = childLocationName
      }

      pageCollector.push({
        ...defaultPage,
        url: getUrlFromCurrentLocation(
          childLocation,
          'https://www.isweedlegalhere.com/browse'
        ),
        priority: 0.9,
      })

      if (childLocationGroup.key) {
        enumerateBrowseLocations(childLocation, pageCollector)
      }
    })
  })
}

const emptyCurrentLocation = getCurrentLocationFromUrlParams([])
const browsePages: MetadataRoute.Sitemap = []

enumerateBrowseLocations(emptyCurrentLocation, browsePages)

export default function sitemap(): MetadataRoute.Sitemap {
  return [defaultPage, ...browsePages]
}
