import { defineEventHandler, getQuery } from 'h3'
import { useRuntimeConfig } from '#imports'
import { getRatesSWR, refreshRatesNow } from '../utils/rates-cache'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const force =
    query.force === '1' ||
    query.force === 'true' ||
    query.force === 'yes'

  const entry = force ? await refreshRatesNow() : await getRatesSWR()
  const config = useRuntimeConfig()
  const moduleConfig = config.converterModule || {}
  const ttlSec =
    typeof moduleConfig.ttlSec === 'number' && Number.isFinite(moduleConfig.ttlSec)
      ? moduleConfig.ttlSec
      : 300

  return {
    payload: entry.payload,
    fetchedAt: entry.fetchedAt,
    ttlMs: ttlSec > 0 ? ttlSec * 1000 : 0,
  }
})
