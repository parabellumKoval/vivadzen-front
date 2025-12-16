export default defineI18nConfig(() => {
  return {
    fallbackLocale: 'ru',
    numberFormats: {
      uk: {
        currency: {
          style: 'currency', 
          currency: 'UAH',
          currencyDisplay: 'narrowSymbol',
          useGrouping: true,
          minimumFractionDigits: 0
        },
        cur: {
          style: 'decimal',
          minimumFractionDigits: 2
        },
        distance: {
          style: 'unit',
          minimumFractionDigits: 2,
          unit: 'kilometer',
          unitDisplay: 'short'
        },
        minute: {
          style: 'unit', 
          useGrouping: false,
          unit: 'minute'
        },
      },
      ru: {
        currency: {
          style: 'currency', 
          currency: 'UAH',
          currencyDisplay: 'narrowSymbol',
          useGrouping: true,
          minimumFractionDigits: 0
        },
        cur: {
          style: 'decimal',
          minimumFractionDigits: 2
        },
        distance: {
          style: 'unit',
          minimumFractionDigits: 2,
          unit: 'kilometer',
          unitDisplay: 'short'
        },
        minute: {
          style: 'unit', 
          useGrouping: false,
          unit: 'minute'
        },
      },
    },

    datetimeFormats: {
      uk: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      ru: {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        },
        long: {
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
    },

    pluralRules: {
      ru: (choice, choicesLength) => {
        if (choice === 0) return 2
        const teen = choice > 10 && choice < 20
        const endsWithOne = choice % 10 === 1
        if (!teen && endsWithOne) return 0          // 1, 21, 31... → товар
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) return 1 // 2-4, 22-24, 32-34... → товара
        return 2                                     // 0, 5-20, 25-30... → товаров
      }
    }
  }
})