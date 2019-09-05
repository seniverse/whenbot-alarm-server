import { AlarmContent, AlarmMessage, Location } from '../modules/types/alarm'
import store from '../services/store'
import logger from '../utils/logger'
import mq from './mq'

const alertAlarm = async (
  alarm: AlarmContent,
  location: Location,
  cancel = false
) => {
  await store.setAlarm(alarm, location, cancel)
  if (!cancel) {
    mq.createCancelJob(alarm, location)
  }
}

const handleAlarm = async (alarmMessage: AlarmMessage) => {
  const { data: alarmData } = alarmMessage
  for (const alarm of alarmData) {
    const { success, data: alarmContent } = alarm
    if (!success) {
      // TODO: thorw error
      continue
    }
    for (const content of alarmContent) {
      const { status, references } = content
      const location: Location = { v3: content.locationV3 }
      await alertAlarm(
        content,
        location,
        status.toLowerCase() === 'cancel' && Boolean(references)
      )
    }
  }
}

export default {
  handleAlarm,
  alertAlarm
}
