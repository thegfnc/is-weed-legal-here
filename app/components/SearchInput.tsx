import { useRef, useEffect } from 'react'
import { places } from '../data/maps'

enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Places library could not be loaded.',
}

const options: google.maps.places.AutocompleteOptions = {
  fields: ['address_components', 'types'],
}

export default function SearchInput() {
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
        placeholder='Search...'
        ref={inputRef}
        className='w-1/4'
      />
    </>
  )
}
