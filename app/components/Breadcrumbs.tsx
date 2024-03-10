import Link from 'next/link'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '../helpers/getUrlFromCurrentLocation'
import { CurrentLocation } from '../types'
import { Fragment } from 'react'
import { MdChevronRight } from 'react-icons/md'

type BreadrumbsProps = {
  currentLocation: CurrentLocation
}

export default function Breadcrumbs({ currentLocation }: BreadrumbsProps) {
  if (currentLocation.country === DASH_PLACEHOLDER) {
    return null
  }

  const breadcrumbParts = [{ title: 'World', href: '/browse' }]

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
    <div className='flex flex-wrap items-center justify-center px-2'>
      {breadcrumbParts.map((part, index) => (
        <Fragment key={part.href}>
          <Link
            href={part.href}
            className='whitespace-nowrap text-xs font-bold uppercase leading-loose tracking-wider underline-offset-2 hover:underline'
          >
            {part.title}
          </Link>
          {index !== breadcrumbParts.length - 1 && (
            <MdChevronRight size='20px' className='mx-1' />
          )}
        </Fragment>
      ))}
    </div>
  )
}
