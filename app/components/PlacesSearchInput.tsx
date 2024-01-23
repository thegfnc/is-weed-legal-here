import { useRef, useEffect } from 'react'
import { places } from '../data/maps'

enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Places library could not be loaded.',
}

const options: google.maps.places.AutocompleteOptions = {
  fields: ['address_components', 'types'],
}

export default function PlacesSearchInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    places.then(async placesLib => {
      if (!placesLib) {
        throw new Error(ErrorMessages.LIBRARY_NOT_LOADED)
      }

      if (inputRef.current) {
        const instance = new placesLib.Autocomplete(inputRef.current, options)

        instance.addListener('place_changed', () => {
          const place = instance.getPlace()
          console.log(place)
        })
      }
    })
  }, [])

  return (
    <>
      <input
        type='text'
        placeholder='Search address, city, state, or zip'
        ref={inputRef}
        className='w-full max-w-96 rounded-full border-2 border-brand-purple bg-transparent px-8 py-4 text-lg leading-none transition-colors placeholder:text-brand-purple focus:bg-white'
      />
    </>
  )
}
