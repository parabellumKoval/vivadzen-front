import { ref, onMounted } from 'vue';
import { composableRegistry } from './composableRegistry';

const composableCache = new Map();

export function useLazyComposable(composableKey, composableMethods, composableParams = null) {
  const data = ref(null);

  // Если переданы методы, создаём refs для каждого
  const methods = composableMethods
    ? composableMethods.reduce((acc, methodName) => {
        acc[methodName] = ref(null);
        return acc;
      }, {})
    : null;

  const loadComposable = async () => {
    if (composableCache.has(composableKey)) {
      const cached = composableCache.get(composableKey);
      if (composableMethods) {
        composableMethods.forEach((methodName) => {
          methods[methodName].value = cached[methodName];
        });
      } else {
        data.value = cached;
      }
      return;
    }

    try {
      if (!composableRegistry[composableKey]) {
        throw new Error(`Composable "${composableKey}" not registered.`);
      }

      // console.log(composableKey, composableMethods, composableParams);
      const module = await composableRegistry[composableKey](composableParams);
      // Если есть default экспорт — используем его, иначе первый экспорт
      const composable =
        typeof module.default === 'function'
          ? module.default()
          : module[Object.keys(module)[0]]();

      if (composableMethods) {
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
      } else {
        data.value = composable;
        composableCache.set(composableKey, composable);
      }
    } catch (error) {
      console.error(`Ошибка загрузки composable ${composableKey}:`, error);
    }
  };

  if (process.client) {
    onMounted(() => {
      loadComposable();
    });
  }

  // Возвращаем либо методы, либо весь объект
  return composableMethods
    ? { ...methods, loadComposable }
    : { data, loadComposable };
}