import { defineEventHandler, getHeader, getQuery, createError, type H3Event } from 'h3'
import {
  findFetcherEndpointKeyByWebhook,
  inferContextFromHeaders,
  refreshFetcherEndpoint
} from '#fetcher-module/server/utils/cache'

function extractPath(event: H3Event) {
  return event.path || event.node.req.url?.split('?')[0] || '/'
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method?.toUpperCase()
  if (method && method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const path = extractPath(event)
  const endpointKey = findFetcherEndpointKeyByWebhook(path)

  if (!endpointKey) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Fetcher webhook is not configured for this route'
    })
  }

  const query = getQuery(event)
  const headerContext = inferContextFromHeaders({
    'accept-language': getHeader(event, 'accept-language') || undefined,
    'x-region': getHeader(event, 'x-region') || undefined
  })

  const contextProvided =
    typeof query.locale === 'string' || typeof query.region === 'string' || headerContext.locale || headerContext.region
      ? {
          locale: typeof query.locale === 'string' ? query.locale : headerContext.locale,
          region: typeof query.region === 'string' ? query.region : headerContext.region
        }
      : undefined

  const result = await refreshFetcherEndpoint(endpointKey, contextProvided)

  return result
})
