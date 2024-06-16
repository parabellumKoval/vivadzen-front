import {useReviewStore} from '~/store/review'

export const useFetchReview = () => {

  const getReviewsAmount = (type: string) => {
    let typeValue = null;

    switch(type) {
      case 'products':
        typeValue = String.raw`Backpack\Store\app\Models\Product`;
        break;
      case 'shop':
        typeValue = null
        break;
    }

    const query = {
      reviewable_type: typeValue,
      count: 1
    }

    return useAsyncData('reviews-amount', () => useReviewStore().getAll(query, false)).then(({data, error}) => {
      if(data?.value?.meta?.total) {
        return data.value.meta.total
      }
    })
  }

  return {
    getReviewsAmount
  }
}