export const useTransport = () => {
  const items = useState('data-items', () => {return {}})

  const getData = (v: String) => {
    return items.value[v]
  }

  const setData = (v: Object) => {
    items.value = {
      ...items.value,
      ...v
    }
  }

  return {
    setData,
    getData
  }
}