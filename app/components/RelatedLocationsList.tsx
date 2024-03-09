import { MdOutlineLocationOn } from 'react-icons/md'
import { CurrentLocation } from '../types'
import getUrlFromCurrentLocation, {
  DASH_PLACEHOLDER,
} from '../helpers/getUrlFromCurrentLocation'
import Link from 'next/link'

type RelatedLocationsListProps = {
  currentLocation: CurrentLocation
}

export default function RelatedLocationsList({
  currentLocation,
}: RelatedLocationsListProps) {
  const partialCurrentLocation: CurrentLocation = {
    country: DASH_PLACEHOLDER,
    administrativeAreaLevel1: DASH_PLACEHOLDER,
    administrativeAreaLevel2: DASH_PLACEHOLDER,
    locality: DASH_PLACEHOLDER,
    postalCode: DASH_PLACEHOLDER,
  }

  const relatedLocations = []

  if (currentLocation.country !== DASH_PLACEHOLDER) {
    partialCurrentLocation.country = currentLocation.country

    relatedLocations.push({
      name: currentLocation.country,
      href: getUrlFromCurrentLocation(partialCurrentLocation, '/browse'),
    })
  }

  if (currentLocation.administrativeAreaLevel1 !== DASH_PLACEHOLDER) {
    partialCurrentLocation.administrativeAreaLevel1 =
      currentLocation.administrativeAreaLevel1

    relatedLocations.push({
      name: currentLocation.administrativeAreaLevel1,
      href: getUrlFromCurrentLocation(partialCurrentLocation, '/browse'),
    })
  }

  if (currentLocation.administrativeAreaLevel2 !== DASH_PLACEHOLDER) {
    partialCurrentLocation.administrativeAreaLevel2 =
      currentLocation.administrativeAreaLevel2

    relatedLocations.push({
      name: currentLocation.administrativeAreaLevel2,
      href: getUrlFromCurrentLocation(partialCurrentLocation, '/browse'),
    })
  }

  if (currentLocation.locality !== DASH_PLACEHOLDER) {
    partialCurrentLocation.locality = currentLocation.locality

    relatedLocations.push({
      name: currentLocation.locality,
      href: getUrlFromCurrentLocation(partialCurrentLocation, '/browse'),
    })
  }

  // pop the last one off because it's the current location
  relatedLocations.pop()

  return (
    <div className='border-2 border-brand-purple text-[16px]'>
      <h3 className='p-6 font-bold uppercase leading-none'>
        Related Locations
      </h3>
      <div className='border-t-2 border-brand-purple'>
        <ul>
          {relatedLocations.map(({ name, href }, index) => (
            <li
              key={name}
              className={
                'mx-6' + (index !== 0 ? ' border-t-2 border-brand-purple' : '')
              }
            >
              <Link
                href={href}
                className='flex items-center gap-[6px] py-4 underline-offset-2 hover:underline'
              >
                <MdOutlineLocationOn size='24' />
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
