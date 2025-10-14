import { getSettingsSWR } from '../utils/settings-cache'

export default defineEventHandler(async (event) => {
  try {
    const settings = await getSettingsSWR()
    // @ts-ignore
    event.context.settings = settings
  } catch (e) {
    // @ts-ignore
    event.context.settings = {}
  }
})
