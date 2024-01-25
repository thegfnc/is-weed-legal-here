enum ErrorMessages {
  LIBRARY_NOT_LOADED = 'Maps library could not be loaded.',
  PERMISSION_DENIED = 'Allow location access to see if you can legally light one up!',
  POSITION_UNAVAILABLE = "Bummer! The browser won't share your current location.",
  TIMEOUT = 'Did you space out? Allow location access to see if you can legally light one up!',
  UNKNOWN = "An unknown error occurred. That's not very chill. Try hitting that refresh button.",
  BAD_LAT_LONG = 'Could not interpret your location based on provided lattitude and longitude coordinates.',
  SELECT_FROM_LIST = 'Please select a location from the autocomplete dropdown.',
}

export default ErrorMessages
