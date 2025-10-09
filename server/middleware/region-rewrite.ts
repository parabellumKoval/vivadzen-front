// server/middleware/region-rewrite.ts
const REGION_CODES = ['ua', 'cz', 'de', 'es'];                 // страны
const LOCALE_CODES = ['uk', 'ru', 'cs', 'de', 'en', 'es'];     // языки (2-й сегмент)

export default defineEventHandler((event) => {
  const original = event.node.req.url || '/';

  // Матчим: /{region}/{optional-locale}/rest...
  const m = original.match(/^\/([a-z]{2})(?:\/([a-z]{2}))?(\/.*)?$/i);
  if (!m) {
    event.context.region = 'global';
    return; // не трогаем URL — роутер увидит /about и т.п.
  }

  const [, seg1, seg2, restRaw] = m;
  const region = (seg1 || '').toLowerCase();
  const maybeLocale = (seg2 || '').toLowerCase();
  const rest = restRaw || '/';

  if (!REGION_CODES.includes(region)) {
    event.context.region = 'global';
    return;
  }

  event.context.region = region;

  if (maybeLocale && LOCALE_CODES.includes(maybeLocale)) {
    event.context.forcedLocale = maybeLocale;
    event.node.req.url = rest || '/';      // сняли /{region}/{locale}
  } else {
    event.node.req.url = rest || '/';      // сняли /{region}
  }

  // Для отладки — увидишь в консоли dev-сервера
  console.log('[region-rewrite]', { original, region, maybeLocale, context: event.context });
});
