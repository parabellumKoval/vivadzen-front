const AGE_GATE_STORAGE_KEY = 'vivadzen-age-confirmed'

export const useAgeGate = () => {
  const isConfirmed = useState('ageGateConfirmed', () => false)

  const readFromStorage = () => {
    if (!process.client)
      return isConfirmed.value

    const storedValue = localStorage.getItem(AGE_GATE_STORAGE_KEY)
    const confirmed = storedValue === 'true'
    isConfirmed.value = confirmed
    return confirmed
  }

  const confirm = () => {
    isConfirmed.value = true

    if (process.client) {
      localStorage.setItem(AGE_GATE_STORAGE_KEY, 'true')
    }
  }

  return {
    isConfirmed,
    confirm,
    readFromStorage,
    storageKey: AGE_GATE_STORAGE_KEY
  }
}
