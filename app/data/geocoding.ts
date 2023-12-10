import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({
  apiKey: 'AIzaSyAtFp26-bVYD6DfUZwl_FvhGh0XhScKEI0',
  version: 'weekly',
})

const geocoding = globalThis.navigator
  ? loader.importLibrary('geocoding')
  : Promise.resolve(null)

export default geocoding
