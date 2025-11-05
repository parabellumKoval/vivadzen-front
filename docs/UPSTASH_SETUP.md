# Настройка Upstash Redis для кеширования на Vercel

## 1. Создание Upstash Redis базы данных

1. Зайдите на [Upstash Console](https://console.upstash.com/)
2. Создайте новую Redis базу данных:
   - Name: `vivadzen-cache` (или любое другое имя)
   - Region: выберите ближайший к вашим пользователям (Europe для EU, US-East для US)
   - Type: Regional (более дешевый)

## 2. Получение креденциалов

После создания базы данных, на странице Details вы найдете:
- **UPSTASH_REDIS_REST_URL**: REST API URL
- **UPSTASH_REDIS_REST_TOKEN**: REST API Token

## 3. Настройка переменных окружения

### Локальная разработка (.env)
```bash
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Vercel Environment Variables
В Vercel Dashboard → Settings → Environment Variables добавьте:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

## 4. Альтернативная настройка через Vercel Integration

1. В Vercel Dashboard → Integrations
2. Найдите "Upstash" и установите интеграцию
3. Это автоматически создаст базу данных и настроит переменные окружения

## 5. Проверка работы

После деплоя проверьте логи Vercel:
```
[category-cache] Writing category entry to cache { slug: 'your-slug', ... }
[category-cache] Reading category entry from cache { found: true, ... }
```

## 6. Мониторинг

- В Upstash Console можете видеть метрики использования
- Количество операций, память, латентность
- Free tier: 10,000 команд/день, 256MB памяти

## Преимущества Upstash на Vercel:

✅ **Персистентность** - данные сохраняются между serverless функциями
✅ **Глобальная репликация** - быстрый доступ из любого региона  
✅ **Автоматическое масштабирование** - нет необходимости в управлении
✅ **HTTP REST API** - не нужны долгие соединения
✅ **Free tier** - достаточно для большинства проектов