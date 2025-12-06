import { computed } from 'vue'
import type { ComputedRef } from 'vue'

interface SupportMethod {
  id: string
  title: string
  description: string
}

interface UseSupportContentResult {
  deliveryDetails: ComputedRef<SupportMethod[]>
  paymentDetails: ComputedRef<SupportMethod[]>
  guaranteeDetails: ComputedRef<string[]>
  deliveryCopy: Record<string, string> | null
  paymentCopy: Record<string, string> | null
  guaranteesCopy: Record<string, string> | null
}

const formatMethods = (
  methods: ComputedRef<any[]>,
  copy: Record<string, string> | null
) => {
  return computed<SupportMethod[]>(() => {
    if (!methods?.value?.length) {
      return []
    }

    return methods.value.reduce<SupportMethod[]>((acc, method) => {
      const key = method?.key
      if (!key || !copy?.[key]) {
        return acc
      }

      acc.push({
        id: key,
        title: method.title,
        description: copy[key]
      })
      return acc
    }, [])
  })
}

export const useSupportContent = async (): Promise<UseSupportContentResult> => {
  const {locale} = useI18n()
  const {methods: deliveryMethods} = useDelivery()
  const {methodsInfo: paymentMethods} = usePayment()

  const [deliveryCopy, paymentCopy, guaranteesCopy] = await Promise.all([
    queryContent('delivery').locale(locale.value).findOne(),
    queryContent('payment').locale(locale.value).findOne(),
    queryContent('guarantees').locale(locale.value).findOne()
  ])

  const deliveryDetails = formatMethods(deliveryMethods, deliveryCopy)
  const paymentDetails = formatMethods(paymentMethods, paymentCopy)
  const guaranteeDetails = computed<string[]>(() => {
    if (!guaranteesCopy) {
      return []
    }

    const entries = [guaranteesCopy.item1, guaranteesCopy.item2, guaranteesCopy.item3, guaranteesCopy.item4]
    return entries.filter((entry): entry is string => Boolean(entry))
  })

  return {
    deliveryDetails,
    paymentDetails,
    guaranteeDetails,
    deliveryCopy,
    paymentCopy,
    guaranteesCopy
  }
}
