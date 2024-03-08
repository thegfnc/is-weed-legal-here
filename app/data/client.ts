import { createClient, QueryParams } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

type SanityFetchParams = {
  query: string
  params?: QueryParams
}

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
}: SanityFetchParams) {
  return client.fetch<QueryResponse>(query, params, {
    next: { revalidate: 60 },
  })
}
