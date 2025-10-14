export const composableRegistry = {
  useQuerySingleton: (params) => import('~/composables/lazy/catalog/useQuerySingleton').then(mod => ({
    ...mod,
    default: () => mod.useQuerySingleton(params)
  }))
};
