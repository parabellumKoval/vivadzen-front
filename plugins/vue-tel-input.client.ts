import VueTelInput from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueTelInput, {
    mode: 'international',
    autoDefaultCountry: false,
    onlyCountries: ['UA', 'CZ', 'DE', 'ES'],
    dropdownOptions: {
      showDialCodeInList: true,
      showDialCodeInSelection: true,
      showFlags: true
    },
    inputOptions: {
      autocomplete: 'tel',
      type: 'tel'
    }
  })
})
