import { defineEventHandler, readBody } from 'h3'
import { refreshCategoryList } from '../utils/cache'

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, any> | undefined>(event).catch(() => undefined)
  const maybeQuery =
    body && typeof body === 'object'
      ? ('query' in body ? (body.query as Record<string, any>) : body)
      : undefined
  const query =
    maybeQuery && typeof maybeQuery === 'object' && !Array.isArray(maybeQuery)
      ? maybeQuery
      : undefined

  const result = await refreshCategoryList(query)

  return {
    success: true,
    ...result
  }
})
