type Options = {
  lazy?: boolean,
  server?: boolean
}

import { useRegionStore } from "~/store/region";

export const useApiFetch = async (
  url: string, 
  body: Object | null = null, 
  method: string = 'GET',
  options: Options = {}
) => {
  
  const getPairs = (obj, keys = []) =>
    Object.entries(obj).reduce((pairs, [key, value]) => {
      if (typeof value === 'object')
        pairs.push(...getPairs(value, [...keys, key]));
      else
        pairs.push([[...keys, key], value]);
      return pairs;
    }, []);
    
  const locale = useNuxtApp().$i18n.locale
  const region = useRegion().region.value

  const headers = {
    'Accept': 'application/json',
    'X-XSRF-TOKEN': useCookie('XSRF-TOKEN').value,
    'X-Requested-With': 'XMLHttpRequest',
    'Accept-Language': locale.value
  };
  

  let data = null;
  let error = null;
  let exception = null;

  const baseOptions = {
    method: method,
    headers: headers,
    credentials: 'include',
    onResponse({response}) {
      //console.log('ON RESP', response, response._data, response.data )
      if(response.ok)
        data = response._data
      else
        error = response._data
    },
    async onResponseError({response}) {
      exception = response._data
    }
  }

  let allOptions = {
    ...baseOptions,
    ...options
  }

  let fullBody = {
    ...body,
  }

  if(region) {
    fullBody.country = region
  }

  if(method === 'GET' && fullBody) {

    let x = getPairs(fullBody)
      .map(([[key0, ...keysRest], value]) =>
        `${key0}${keysRest.map(a => `[${a}]`).join('')}=${value}`)
      .join('&');

    // const params = body? '?' + new URLSearchParams(body).toString(): '';
    const params = fullBody? '?' + x: '';
    url = url + params

  }else if(method === 'POST' && fullBody) {
    allOptions.body = JSON.parse(JSON.stringify(fullBody))
  }

  if(options.lazy) {
    return useLazyFetch(url, allOptions);
  }else {
    return await useFetch(url, allOptions);
  }

  return {
    data,
    error,
    exception
  }
}