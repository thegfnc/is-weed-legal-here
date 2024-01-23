'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { places } from '../data/maps'
import { MdSearch } from 'react-icons/md'
import getCurrentLocationFromPlaceResult from '../helpers/getCurrentLocationFromPlaceResult'
import getUrlFromCurrentLocation from '../helpers/getUrlFromCurrentLocation'
import ErrorMessages from '../data/errorMessages'

const options: google.maps.places.AutocompleteOptions = {
  fields: ['address_components', 'types'],
}

export default function PlacesSearchInput() {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocusInput = () => {
    inputRef.current?.focus()
  }

  const attachAutocomplete = useCallback(async () => {
    const placesLib = await places

    if (!placesLib) {
      throw new Error(ErrorMessages.LIBRARY_NOT_LOADED)
    }

    if (inputRef.current) {
      const instance = new placesLib.Autocomplete(inputRef.current, options)

      instance.addListener('place_changed', () => {
        const place = instance.getPlace()
        const currentLocation = getCurrentLocationFromPlaceResult(place)
        const url = getUrlFromCurrentLocation(currentLocation, '/result')
        router.push(url)
      })
    }
  }, [inputRef, router])

  useEffect(() => {
    attachAutocomplete()
  }, [attachAutocomplete])

  return (
    <div
      className={`relative flex max-w-96 items-center overflow-hidden rounded-full border-2 border-brand-purple py-4 pl-11 pr-8 ${isFocused ? 'bg-white' : 'bg-transparent'}`}
      onClick={handleFocusInput}
    >
      <MdSearch size='24px' className='pointer-events-none absolute left-4' />
      <input
        type='text'
        placeholder='Search address, city, state, or zip'
        ref={inputRef}
        className='w-[367px] max-w-full bg-transparent text-lg leading-none transition-colors placeholder:text-brand-purple focus:outline-none'
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}
