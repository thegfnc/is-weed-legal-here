'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPlacesClient } from '../data/mapsClient'
import { MdSearch } from 'react-icons/md'
import getCurrentLocationFromPlaceResult from '../helpers/getCurrentLocationFromPlaceResult'
import getUrlFromCurrentLocation from '../helpers/getUrlFromCurrentLocation'
import ErrorMessages from '../data/errorMessages'
import LoadingStates from '../data/loadingStates'
import useKey from '../hooks/useKey'

type PlaceAutocompleteInputProps = {
  setLoadingState: (loadingState: LoadingStates | null) => void
  setErrorMessage: (errorMessage: ErrorMessages | null) => void
}

export default function PlacesAutocompleteInput({
  setLoadingState,
  setErrorMessage,
}: PlaceAutocompleteInputProps) {
  const router = useRouter()

  // session token is a string to group autocomplete service requests with get place detail requests
  // it's for billing purposes. See the docs: https://developers.google.com/maps/documentation/places/web-service/session-tokens
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken>()
  const attributionRef = useRef<HTMLDivElement>(null)
  const suggestionsTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const isFocusedTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const inputRef = useRef<HTMLInputElement>(null)

  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[] | null
  >(null)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(0)

  const handleFocusInput = () => {
    inputRef.current?.focus()
  }

  const loadSuggestions = async (inputValue: string) => {
    clearTimeout(suggestionsTimeoutRef.current)

    // don't load suggestions if not enough characters
    if (!inputValue || inputValue.trim().length < 3) {
      setSuggestions(null)
      return
    }

    suggestionsTimeoutRef.current = setTimeout(async () => {
      const placesLib = await getPlacesClient()

      if (!placesLib) {
        setErrorMessage(ErrorMessages.LIBRARY_NOT_LOADED)
        return
      }

      if (!sessionTokenRef.current) {
        sessionTokenRef.current = new placesLib.AutocompleteSessionToken()
      }

      new placesLib.AutocompleteService().getPlacePredictions(
        {
          input: inputValue,
          sessionToken: sessionTokenRef.current,
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setSuggestions([])
            return
          }

          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            return
          }

          setSuggestions(predictions)
        }
      )
    }, 300)
  }

  const handleSuggestionSelected = async () => {
    if (suggestions === null) return

    const selectedSuggestion = suggestions[selectedSuggestionIndex]

    setSuggestions(null)

    const placesLib = await getPlacesClient()

    if (!placesLib || attributionRef.current === null) {
      setErrorMessage(ErrorMessages.LIBRARY_NOT_LOADED)
      return
    }

    // Clear the session token, it can only be used in one request
    const sessionToken = sessionTokenRef.current
    sessionTokenRef.current = undefined

    new placesLib.PlacesService(attributionRef.current).getDetails(
      {
        placeId: selectedSuggestion.place_id,
        fields: ['address_components', 'types'],
        sessionToken,
      },
      (place, status) => {
        setLoadingState(LoadingStates.SEARCHING_FOR_DATA)

        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const currentLocation = getCurrentLocationFromPlaceResult(place)
          const url = getUrlFromCurrentLocation(currentLocation, '/result')
          router.push(url)
        }
      }
    )
  }

  const incrementSelectedSuggestionIndex = (e: KeyboardEvent) => {
    e.preventDefault()
    if (suggestions === null) return
    setSelectedSuggestionIndex(
      (selectedSuggestionIndex + 1) % suggestions.length
    )
  }

  const decrementSelectedSuggestionIndex = (e: KeyboardEvent) => {
    if (suggestions === null) return
    e.preventDefault()
    setSelectedSuggestionIndex(
      (selectedSuggestionIndex - 1 + suggestions.length) % suggestions.length
    )
  }

  const handleEnterToSelectSuggestion = (e: KeyboardEvent) => {
    if (suggestions === null) return
    e.preventDefault()
    handleSuggestionSelected()
  }

  useKey('ArrowUp', decrementSelectedSuggestionIndex, {}, [
    selectedSuggestionIndex,
    suggestions,
  ])

  useKey('ArrowDown', incrementSelectedSuggestionIndex, {}, [
    selectedSuggestionIndex,
    suggestions,
  ])

  useKey('Enter', handleEnterToSelectSuggestion, {}, [
    selectedSuggestionIndex,
    suggestions,
  ])

  return (
    <div className='flex justify-center'>
      <div className='relative w-full max-w-96'>
        <div
          className={`relative flex items-center overflow-hidden rounded-full border-2 border-brand-purple py-4 pl-11 pr-8 ${isFocused ? 'bg-white' : 'bg-transparent'}`}
          onClick={handleFocusInput}
        >
          <MdSearch
            size='24px'
            className='pointer-events-none absolute left-4'
          />
          <input
            type='text'
            placeholder='Search address, city, state, or zip'
            onChange={event => loadSuggestions(event.target.value)}
            ref={inputRef}
            className='w-full bg-transparent text-lg leading-none transition-colors placeholder:text-brand-purple focus:outline-none'
            onFocus={() => {
              clearTimeout(isFocusedTimeoutRef.current)
              setIsFocused(true)
            }}
            onBlur={() => {
              // setTimeout to allow clicking on item before hiding suggestions
              isFocusedTimeoutRef.current = setTimeout(
                () => setIsFocused(false),
                200
              )
            }}
          />
        </div>
        {suggestions &&
          isFocused &&
          (suggestions.length > 0 ? (
            <ul className='absolute left-6 right-6 top-full bg-white px-2 py-3 text-sm shadow-md'>
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.place_id}
                  onClick={handleSuggestionSelected}
                  onMouseOver={() => setSelectedSuggestionIndex(index)}
                  className={`cursor-pointer px-2 py-1 active:bg-brand-purple/80 ${selectedSuggestionIndex === index ? 'bg-brand-purple text-white' : ''}`}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          ) : (
            <div className='absolute left-6 right-6 top-full bg-white py-3 text-sm shadow-md'>
              No suggestions found for this location.
            </div>
          ))}
        <div ref={attributionRef}></div>
      </div>
    </div>
  )
}
