# GA4 + GTM Ecommerce Setup For `src/front`

Этот проект уже пушит ecommerce- и диагностические события в `dataLayer` через `regional-gtm`.

Ниже описано:

1. Какие события теперь уходят с фронта.
2. Как настроить GTM, чтобы они реально отправлялись в GA4.
3. Как настроить GA4 для revenue, conversions, funnel и диагностики потерь трафика/конверсии.

## Что уже реализовано во фронте

Источник событий:

- `composables/useGoogleEvent.ts`

Основные точки отправки:

- `layouts/catalog.vue`: `view_item_list`
- `components/Checkout/List/List.vue`: `view_item_list` для рекомендаций/списков в checkout
- `components/Product/Card/Card.vue`: `select_item`
- `components/Product/Card/Checkout/Small/Small.vue`: `select_item`
- `components/Page/Product/Product.vue`: `view_item`
- `composables/product/useCart.ts`: `add_to_cart`
- `components/Product/Card/Checkout/Checkout.vue`: `remove_from_cart`, а также `add_to_cart`/`remove_from_cart` при изменении количества
- `components/Modal/Cart/Cart.client.vue`: `view_cart`
- `pages/checkout/index.client.vue`: `begin_checkout`, `add_shipping_info`, `add_payment_info`
- `pages/checkout/complete/[code]/index.vue`: `purchase`
- `pages/search/index.vue`: `search`
- `components/Checkout/Sale/Sale.vue`, `pages/checkout/payment/index.vue`: `checkout_error`

## Какие события уходят в `dataLayer`

### Ecommerce-события

- `view_item_list`
- `select_item`
- `view_item`
- `add_to_cart`
- `remove_from_cart`
- `view_cart`
- `begin_checkout`
- `add_shipping_info`
- `add_payment_info`
- `purchase`

Для ecommerce-событий фронт отправляет объект `ecommerce` и перед этим пушит `ecommerce: null`, чтобы GTM не подхватывал старые значения из предыдущего события.

### Дополнительные события

- `search`
- `checkout_error`

### Важные детали реализации

- `purchase` защищён от повторной отправки на одном устройстве по `transaction_id`.
- `currency` отправляется вместе с денежными событиями.
- В `purchase` дополнительно уходят `transaction_id`, `coupon`, `shipping_tier`, `payment_type`, `shipping`, `discount`, `items`.
- Для `shipping` и `payment` используются стабильные коды методов, а не локализованные подписи. Это правильно для аналитики.

## Важное про контейнеры GTM

В проекте используется региональный GTM:

- `GTM_GLOBAL` / `GTM_ZZ`
- `GTM_UA`
- `GTM_CZ`
- `GTM_DE`
- `GTM_ES`

Смотри:

- `nuxt.config.ts`
- `modules/regional-gtm/runtime/plugins/regional-gtm.client.ts`

Если у тебя реально несколько GTM-контейнеров по регионам, изменения ниже нужно повторить в каждом контейнере.

## Настройка GTM

### 1. Проверь базовый Google tag / GA4 Configuration

В GTM должен быть тег для GA4:

- либо `Google tag`
- либо `GA4 Configuration`

Он должен быть привязан к нужному `Measurement ID` формата `G-XXXXXXX`.

Если тег уже есть и работает, оставь его.

### 2. Включи built-in переменную `Event`

В GTM:

- `Variables`
- `Configure`
- включи built-in variable `Event`

Она понадобится, чтобы одним тегом принимать несколько ecommerce-событий.

### 3. Создай триггер для ecommerce-событий

Тип:

- `Custom Event`

Настройки:

- Trigger name: `CE - GA4 Ecommerce`
- Event name: regex

Regex:

```text
^(view_item_list|select_item|view_item|add_to_cart|remove_from_cart|view_cart|begin_checkout|add_shipping_info|add_payment_info|purchase)$
```

Включи опцию regex matching.

### 4. Создай один общий GA4 ecommerce tag

Тип:

- `Google Analytics: GA4 Event`

Настройки:

- Configuration tag: существующий GA4 config tag / Google tag
- Event Name: `{{Event}}`
- Ecommerce: `Send Ecommerce data`
- Source: `Data Layer`

Trigger:

- `CE - GA4 Ecommerce`

Идея в том, что фронт уже пушит правильный `event` и правильный `ecommerce`, поэтому GTM не нужно дублировать бизнес-логику.

### 5. Создай тег для `search`

Тип:

- `Google Analytics: GA4 Event`

Поля:

- Event Name: `search`
- Parameter `search_term` -> Data Layer Variable `search_term`
- Parameter `results_count` -> Data Layer Variable `results_count`

Trigger:

- `Custom Event`
- Event name: `search`

Нужные Data Layer Variables:

- `DLV - search_term`
- `DLV - results_count`

### 6. Создай тег для `checkout_error`

Тип:

- `Google Analytics: GA4 Event`

Event Name:

- `checkout_error`

Параметры:

- `checkout_step`
- `shipping_method`
- `payment_method`
- `item_count`
- `value`
- `error_sections`

Trigger:

- `Custom Event`
- Event name: `checkout_error`

Создай для них Data Layer Variables:

- `DLV - checkout_step`
- `DLV - shipping_method`
- `DLV - payment_method`
- `DLV - item_count`
- `DLV - value`
- `DLV - error_sections`

### 7. Протестируй через Preview

В GTM:

- `Preview`
- открой сайт
- пройди сценарии: каталог -> карточка -> add to cart -> cart -> checkout -> purchase

Ты должен увидеть в Tag Assistant:

- нужные custom events
- срабатывание GA4 тегов
- корректный `ecommerce.items`
- корректные `value`, `currency`, `transaction_id`

Полезные официальные материалы:

- [Data layer | Google for Developers](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [Tag Assistant Help](https://support.google.com/tagassistant/?hl=en)

## Настройка GA4

### 1. Проверь web data stream

В GA4:

- `Admin`
- `Data streams`
- выбери web stream

Проверь:

- включён ли Enhanced measurement
- правильно ли подключён `Measurement ID`

### 2. Site search: добавь query-параметр `q`

У вас поиск работает через URL вида:

```text
/search?q=...
```

По документации GA4 `view_search_results` может собираться автоматически, если поиск определяется query-параметром URL.

Поэтому в web stream:

- открой `Enhanced measurement`
- `Show advanced settings`
- `Site search`
- добавь query parameter `q`

Это даст тебе ещё и стандартный `view_search_results` поверх нашего кастомного `search`.

Официально:

- [Automatically collected events](https://support.google.com/analytics/answer/9234069)

### 3. Пометь ключевые события

В GA4:

- `Admin`
- `Events`
- `Mark as key event`

Минимум рекомендую:

- `purchase`

Опционально, для воронки:

- `begin_checkout`
- `add_payment_info`

Для рекламной оптимизации и реального revenue главным должен оставаться `purchase`.

Официально:

- [GA4 Key event](https://support.google.com/analytics/answer/9355848)

### 4. Зарегистрируй custom definitions для диагностических параметров

Чтобы нормально анализировать `checkout_error`, создай custom definitions:

- event-scoped dimension `checkout_step`
- event-scoped dimension `shipping_method`
- event-scoped dimension `payment_method`
- event-scoped dimension `error_sections`

Опционально:

- custom metric `results_count`
- custom metric `item_count`

Без этого параметры будут видны в DebugView / BigQuery / некоторых explorations, но не в стандартных отчётах так удобно, как хотелось бы.

### 5. Проверь DebugView

В GA4:

- `Admin`
- `DebugView`

Открой сайт через GTM Preview/Tag Assistant и пройди воронку. События должны появляться почти сразу.

Официально:

- [Monitor events in DebugView](https://support.google.com/analytics/answer/7201382?hl=en)

## Как смотреть revenue, конверсию и воронку

### Revenue и покупки

Смотри:

- `Reports -> Monetization -> Ecommerce purchases`
- `Reports -> Monetization -> Overview`

Здесь должны появиться:

- item revenue
- purchase revenue
- товары
- quantity
- cart-to-view / purchase-to-view rate

Это заработает только если GTM реально отправляет ecommerce payload в GA4.

### Основная воронка

Собери Funnel exploration:

1. `session_start` или `page_view`
2. `view_item_list`
3. `select_item`
4. `view_item`
5. `add_to_cart`
6. `view_cart`
7. `begin_checkout`
8. `add_shipping_info`
9. `add_payment_info`
10. `purchase`

Отдельно полезно строить укороченную воронку:

1. `view_item`
2. `add_to_cart`
3. `begin_checkout`
4. `purchase`

### Где теряется конверсия

Смотри одновременно:

- Funnel exploration по событиям выше
- отчёт по `checkout_error`
- разрезы по `shipping_method`
- разрезы по `payment_method`
- разрезы по `device category`
- разрезы по `country` / `region`
- разрезы по `session source / medium`

Если видишь:

- много `begin_checkout`, но мало `add_payment_info`: проблема в доставке или шагах формы
- много `add_payment_info`, но мало `purchase`: проблема в платёжном провайдере или возврате на thank-you page
- много `checkout_error`: смотри `checkout_step` + `error_sections`

## Как анализировать эффективность рекламных кампаний

### 1. Не ломай разметку источников трафика

Если трафик не из Google Ads integration, используй полные UTM:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_id`
- `utm_term`
- `utm_content`
- `utm_source_platform`

Если проставить только часть UTM, в отчётах будет больше `(not set)`.

Официально:

- [Traffic-source dimensions, manual tagging, and auto-tagging](https://support.google.com/analytics/answer/11242870?hl=en-BR)

### 2. Свяжи GA4 с Google Ads

Если планируешь оптимизировать кампании по покупкам:

- свяжи property с Google Ads
- импортируй `purchase` как conversion

Если нужен только revenue-анализ внутри GA4, это не обязательно, но для оптимизации кампаний очень желательно.

### 3. Смотри acquisition и attribution

Минимальный набор отчётов:

- `Reports -> Acquisition -> Traffic acquisition`
- `Reports -> Acquisition -> User acquisition`
- `Advertising -> Attribution`

Смотри разрезы:

- `Session source / medium`
- `Session campaign`
- `Landing page`
- `Device category`
- `Country`

Официально:

- [GA4 Attribution](https://support.google.com/analytics/answer/14547371?hl=en)

## Что важно проверить отдельно

### 1. Возврат после оплаты

`purchase` у вас отправляется на странице:

- `/checkout/complete/:code`

Поэтому успешная оплата должна гарантированно возвращать пользователя на эту страницу. Если платёж успешен, но пользователь не вернулся на thank-you page, revenue в GA4 не появится.

### 2. Page view в SPA

GA4 пишет, что `page_view` для web собирается при загрузке страницы и при browser history changes активного сайта, если включено enhanced measurement.

Официально:

- [Automatically collected events](https://support.google.com/analytics/answer/9234069)

Но это всё равно нужно проверить в DebugView на реальной навигации по Nuxt-приложению:

- переход каталог -> товар
- товар -> checkout
- checkout -> complete

Если `page_view` на route change не появляется, тогда отдельно настраивай SPA pageview tracking.

## Рекомендуемый чек-лист запуска

1. Внести GTM-теги и триггеры во все нужные региональные контейнеры.
2. Открыть GTM Preview.
3. Пройти весь e2e-сценарий покупки.
4. Проверить DebugView в GA4.
5. Убедиться, что `purchase` содержит `transaction_id`, `currency`, `value`, `items`.
6. Пометить `purchase` как key event.
7. Создать Funnel exploration.
8. Создать custom definitions для `checkout_error`.
9. Добавить `q` в site search enhanced measurement.
10. Проверить `Traffic acquisition` и `Attribution` после первых реальных сессий.

## Официальные источники

- [Measure ecommerce](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [The data layer](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [Automatically collected events](https://support.google.com/analytics/answer/9234069)
- [Key event](https://support.google.com/analytics/answer/9355848)
- [Monitor events in DebugView](https://support.google.com/analytics/answer/7201382?hl=en)
- [Traffic-source dimensions, manual tagging, and auto-tagging](https://support.google.com/analytics/answer/11242870?hl=en-BR)
- [GA4 Attribution](https://support.google.com/analytics/answer/14547371?hl=en)
