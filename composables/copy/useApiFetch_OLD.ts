type Options = {
  lazy?: boolean,
  server?: boolean
}

export const useApiFetchOLD = async (
  url: string, 
  body: Object | null = null, 
  method: string = 'GET',
  options: Options = {}
) => {
  
  const locale = useNuxtApp().$i18n.locale

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

  if(method === 'GET' && body) {
    const params = body? '?' + new URLSearchParams(body).toString(): '';
    url = url + params
  }else if(method === 'POST' && body) {
    allOptions.body = JSON.parse(JSON.stringify(body))
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