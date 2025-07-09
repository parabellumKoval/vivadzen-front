let categorySlugs: Set<string> = new Set();
let lastUpdated = 0;
const TTL = 10 * 60 * 1000; // 10 минут

export async function getCategorySlugs() {
  const runtimeConfig = useRuntimeConfig()
  const now = Date.now();
  if (now - lastUpdated > TTL || categorySlugs.size === 0) {
    try {
      const res = await $fetch<string[]>(runtimeConfig.public.apiBase + '/djini-category/slugs-simple');
      categorySlugs = new Set(res);
      lastUpdated = now;
      // console.log('[CategoryCache] Updated slugs at', new Date().toISOString());
    } catch (err) {
      // console.error('[CategoryCache] Failed to update:', err);
    }
  }
  return categorySlugs;
}
