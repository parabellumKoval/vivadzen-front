import { defineEventHandler } from 'h3'
import { refreshRatesNow } from '../utils/rates-cache'

export default defineEventHandler(async () => {
  const entry = await refreshRatesNow()

  return {
    ok: true,
    fetchedAt: entry.fetchedAt,
    payload: entry.payload,
  }
})
