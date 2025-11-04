import { defineEventHandler, getHeader, getQuery, createError, type H3Event } from 'h3'
import {
  findFetcherEndpointKeyByRoute,
  getFetcherPayload,
  inferContextFromHeaders,
  type FetcherContextInput
} from '#fetcher-module/server/utils/cache'

function extractPath(event: H3Event) {
  return event.path || event.node.req.url?.split('?')[0] || '/'
}

export default defineEventHandler(async (event) => {
  const path = extractPath(event)
  const endpointKey = findFetcherEndpointKeyByRoute(path)

  if (!endpointKey) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Fetcher endpoint is not configured for this route'
    })
  }

  const query = getQuery(event)
  const headerContext = inferContextFromHeaders({
    'accept-language': getHeader(event, 'accept-language') || undefined,
    'x-region': getHeader(event, 'x-region') || undefined
  })

  const requestContext: FetcherContextInput = {
    locale: typeof query.locale === 'string' ? query.locale : headerContext.locale,
    region: typeof query.region === 'string' ? query.region : headerContext.region
  }

  const result = await getFetcherPayload(endpointKey, requestContext)

  return {
    key: endpointKey,
    context: result.context,
    fetchedAt: result.fetchedAt,
    data: result.payload
  }
})
