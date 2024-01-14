import Link from 'next/link'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '../helpers/getUrlFromCurrentLocation'
import { CurrentLocation } from '../types'

type BreadrumbsProps = {
  currentLocation: CurrentLocation
}

export default function Breadcrumbs({ currentLocation }: BreadrumbsProps) {
  const breadcrumbParts = [{ title: 'Browse', href: '/browse' }]

  const builtCurrentLocation = {
    country: DASH_PLACEHOLDER,
    administrativeAreaLevel1: DASH_PLACEHOLDER,
    administrativeAreaLevel2: DASH_PLACEHOLDER,
    locality: DASH_PLACEHOLDER,
    postalCode: DASH_PLACEHOLDER,
  }

  if (currentLocation.country !== DASH_PLACEHOLDER) {
    builtCurrentLocation.country = currentLocation.country

    breadcrumbParts.push({
      title: currentLocation.country,
      href: getUrlFromCurrentLocation(builtCurrentLocation, '/browse'),
    })
  }

  if (currentLocation.administrativeAreaLevel1 !== DASH_PLACEHOLDER) {
    builtCurrentLocation.administrativeAreaLevel1 =
      currentLocation.administrativeAreaLevel1

    breadcrumbParts.push({
      title: currentLocation.administrativeAreaLevel1,
      href: getUrlFromCurrentLocation(builtCurrentLocation, '/browse'),
    })
  }

  if (currentLocation.administrativeAreaLevel2 !== DASH_PLACEHOLDER) {
    builtCurrentLocation.administrativeAreaLevel2 =
      currentLocation.administrativeAreaLevel2

    breadcrumbParts.push({
      title: currentLocation.administrativeAreaLevel2,
      href: getUrlFromCurrentLocation(builtCurrentLocation, '/browse'),
    })
  }

  if (currentLocation.locality !== DASH_PLACEHOLDER) {
    builtCurrentLocation.locality = currentLocation.locality

    breadcrumbParts.push({
      title: currentLocation.locality,
      href: getUrlFromCurrentLocation(builtCurrentLocation, '/browse'),
    })
  }

  return (
    <div>
      {breadcrumbParts.map((part, index) => (
        <>
          <Link
            key={part.href}
            href={part.href}
            className='underline-offset-2 hover:underline'
          >
            {part.title}
          </Link>
          {index !== breadcrumbParts.length - 1 && (
            <span className='mx-2'>/</span>
          )}
        </>
      ))}
    </div>
  )
}
