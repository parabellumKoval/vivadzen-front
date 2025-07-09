import { createClient } from '@supabase/supabase-js'
let _client = null

export const useSupabaseClientLazy = () => {
  if (_client) return _client
  const config = useRuntimeConfig()
  _client = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  return _client
}