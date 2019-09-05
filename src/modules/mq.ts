import * as Queue from 'bee-queue'
import alarmUtil from './alarm'

import config from '../config'
import { AlarmContent, Location } from '../modules/types/alarm'
import logger from '../utils/logger'

let instance = null
const queueName = config.services.mq.queue.alarm

const getMq = () => {
  if (instance) {
    return instance
  }

  instance = new Queue(queueName, {
    redis: config.services.redis,
    activateDelayedJobs: true
  })
  logger.info(`[CREATE-QUEUE] ${JSON.stringify(queueName)}`)

  instance.process((job, done) => {
    const { data: rawData } = job
    logger.debug(`[ALARM-QUEUE-START] ${JSON.stringify(rawData)}`)

    const { jobType, jobData } = rawData
    if (jobType !== 'cancel') {
      return done(null, 'type ne cancel')
    }

    const { alarm, location } = jobData

    try {
      alarmUtil.alertAlarm(alarm, location, true)
    } catch (error) {
      logger.error(`[ALARM-ALERT-ERROR] ${error}`)
    }

    return done(null, `${location.identifier} delete success`)
  })

  instance.on('error', err => {
    logger.error(`[ALARM-QUEUE-ERROR] ${err.message}`)
  })

  return instance
}

const createCancelJob = async (alarm: AlarmContent, location: Location) => {
  const { expiredAt } = alarm
  const queue = getMq()
  const job = await queue
    .createJob({ jobType: 'cancel', jobData: { alarm, location } })
    .delayUntil(Date.parse(expiredAt))
    .save()
  job.on('succeeded', result => {
    logger.info(`[QUEUE-JOB-SUCCESS] ${JSON.stringify(result)}`)
    queue.removeJob(job.id)
  })
}

export default {
  getMq,
  createCancelJob
}
