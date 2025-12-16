import {useReviewStore} from '~/store/review'

export const useFetchReview = () => {

  const getReviewsAmount = (type: string) => {
    const query: Record<string, any> = {
    }

    switch(type) {
      case 'products':
        query.reviewable_type = String.raw`App\Models\Product`;
        break;
      case 'shop':
        query.reviewable_type = null
        break;
    }

    return useAsyncData('reviews-amount-'+type, () => useReviewStore().amount(query)).then(({data}) => {
      return data
    })
  }

  return {
    getReviewsAmount
  }
}
