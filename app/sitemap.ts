import { MetadataRoute } from 'next'
import getCurrentLocationFromUrlParams from './helpers/getCurrentLocationFromUrlParams'
import getChildLocationsFromLocation from './helpers/getChildLocationGroupsFromLocation'
import getUrlFromCurrentLocation from './helpers/getUrlFromCurrentLocation'

const enumerateBrowseLocations = () => {
  const sitemapPages: MetadataRoute.Sitemap = []

  const location: string[] = []
  const currentLocation = getCurrentLocationFromUrlParams(location)
  const childLocationGroups = getChildLocationsFromLocation(currentLocation)

  childLocationGroups.forEach(childLocationGroup => {
    const childLocationNames = Object.keys(childLocationGroup.data)

    return childLocationNames.forEach(childLocationName => {
      const childLocation = {
        ...currentLocation,
      }

      if (childLocationGroup.key) {
        childLocation[childLocationGroup.key] = childLocationName
      }

      const url = getUrlFromCurrentLocation(
        childLocation,
        'https://www.isweedlegalhere.com/browse'
      )

      sitemapPages.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    })
  })

  return sitemapPages
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.isweedlegalhere.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...enumerateBrowseLocations(),
  ]
}
