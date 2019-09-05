import alarm from '../../modules/alarm'
import { AlarmMessage } from '../../modules/types/alarm'
import { Controller } from '../../modules/types/server'
import logger from '../../utils/logger'

export const checkContent: Controller = async ctx => {
  const body = ctx.request.body
  logger.debug(`[RECEIVED-ALARM] ${JSON.stringify(body)}`)

  try {
    await alarm.handleAlarm(body as AlarmMessage)
  } catch (error) {
    logger.error(`[HANDLE-ALARM-ERROR] ${JSON.stringify(error)}`)
  }

  ctx.body = {
    success: true,
    result: null
  }
}
