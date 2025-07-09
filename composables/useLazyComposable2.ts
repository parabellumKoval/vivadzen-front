import { ref, onMounted } from 'vue';
import { composableRegistry } from './composableRegistry'; // путь адаптируй

const composableCache = new Map();

export function useLazyComposable2(composableKey, composableMethods) {
  const methods = composableMethods.reduce((acc, methodName) => {
    acc[methodName] = ref(null);
    return acc;
  }, {});

  const loadComposable = async () => {
    if (composableCache.has(composableKey)) {
      const cached = composableCache.get(composableKey);
      composableMethods.forEach((methodName) => {
        methods[methodName].value = cached[methodName];
      });
      return;
    }

    try {
      if (!composableRegistry[composableKey]) {
        throw new Error(`Composable "${composableKey}" not registered.`);
      }

      const module = await composableRegistry[composableKey]();
      const composable = module[Object.keys(module)[0]](); // ожидается default или единственный экспорт

      const result = {};
      composableMethods.forEach((methodName) => {
        if (composable[methodName]) {
          methods[methodName].value = composable[methodName];
          result[methodName] = composable[methodName];
        } else {
          console.warn(`Метод ${methodName} не найден в ${composableKey}`);
        }
      });

      composableCache.set(composableKey, result);
    } catch (error) {
      console.error(`Ошибка загрузки composable ${composableKey}:`, error);
    }
  };

  if (process.client) {
    onMounted(() => {
      loadComposable();
    });
  }

  return {
    ...methods,
    loadComposable,
  };
}
