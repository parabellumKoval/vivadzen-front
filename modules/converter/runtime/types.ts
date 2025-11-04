export interface PointRateEntry {
  code: string
  name: string
  rate: number
}

export interface PointRatesResponse {
  base: {
    code: string
    name: string
  }
  rates: PointRateEntry[]
}

export interface ConverterPayload {
  payload: PointRatesResponse
  fetchedAt: number
  ttlMs: number
}
