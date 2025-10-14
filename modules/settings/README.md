# nuxt3-settings-module

Nuxt 3 module that fetches settings from a Laravel API once, caches them in Nitro storage with TTL,
injects them into SSR context, and exposes them to both server and client via `$settings` and `$getSetting`.
Includes a POST refresh endpoint to rebuild the cache on demand (no ETag required).

## Install

Copy the folder into your project, e.g.:

```
/modules/nuxt3-settings-module
```

Then enable in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    './modules/nuxt3-settings-module' // path to this module
  ],
  settingsModule: {
    apiUrl: process.env.SETTINGS_API_URL || 'http://localhost:8000/api/settings',
    ttlSec: parseInt(process.env.SETTINGS_CACHE_TTL_SEC || '300', 10),
    refreshRoutePath: '/api/_refresh-settings'
  }
})
```

## Laravel endpoint

`GET /api/settings` should return a flat JSON map like:

```json
{"profile.users.allow_registration": true, "profile.users.require_email_verification": true}
```

No ETag required.

## Manual refresh

Make a POST request to the refresh route (default: `/api/_refresh-settings`) after you update settings in Laravel.
Add your own auth/secret check inside `runtime/server/api/refresh-settings.post.ts` if needed.

## Usage in components

```vue
<script setup lang="ts">
const { get, all } = useSettings()
const allow = computed(() => get('profile.users.allow_registration', false))
</script>
```

Or via plugin injection:

```ts
const { $getSetting } = useNuxtApp()
const allow = $getSetting('profile.users.allow_registration', false)
```

## How it works

- On first SSR request (cold start), module fetches from Laravel and saves to Nitro storage (`cache:`) with timestamp.
- On subsequent requests, it serves from cache.
- When TTL expires, it serves stale data immediately and refreshes in the background.
- You can trigger an immediate refresh by POSTing to `/api/_refresh-settings`.
```

