import { groupBy } from 'lodash'
import * as moment from 'moment'
import config from '../config'
import {
  STORE_ALL_KEY,
  STORE_CITY_KEY,
  STORE_LIST_KEY
} from '../modules/constant/key'
import formatter from '../modules/formatter'
import { AlarmContent, Location } from '../modules/types/alarm'
import logger from '../utils/logger'
import mysqlService from './mysql'
import redisService from './redis'

const setRedis = async (
  alarm: AlarmContent,
  location: Location,
  cancel = false
) => {
  try {
    const cityAlarm = await redisService.get(STORE_CITY_KEY + location.v3)
    const alarmFormatted = formatter.formatAlarm(
      alarm,
      location,
      cityAlarm || {},
      cancel
    )
    redisService.set(STORE_CITY_KEY + location.v3, alarmFormatted)

    const alarmList = await redisService.get(STORE_LIST_KEY)
    const listFormatted = formatter.formatList(
      alarm,
      location,
      alarmList || {},
      cancel
    )
    redisService.set(STORE_LIST_KEY, {
      alarms: listFormatted
    })

    const alarmCities = await redisService.get(STORE_ALL_KEY)
    const citiesFormatted = formatter.formatAll(
      alarm,
      location,
      alarmCities || {},
      cancel
    )
    redisService.set(STORE_ALL_KEY, {
      alarms: citiesFormatted
    })
  } catch (error) {
    logger.error(`[REDIS-ERROR]${JSON.stringify(error)}`)
  }
}

const setDB = async (
  alarm: AlarmContent,
  location: Location,
  cancel = false
) => {
  const { status, identifier, references } = alarm
  try {
    if (cancel) {
      mysqlService.deleteAlarm(identifier)
    } else {
      if (status.toLowerCase() === 'update') {
        mysqlService.deleteAlarm(references)
      }
      const formattedAlarm = Object.assign(formatter.alarmBase(alarm), {
        city: location.v3
      })
      await mysqlService.insertAlarm(formattedAlarm)
    }
  } catch (error) {
    logger.error(`[MYSQL-ERROR]${JSON.stringify(error)}`)
  }
}

const setAlarm = async (
  alarm: AlarmContent,
  location: Location,
  cancel = false
) => {
  if (config.useRedis) {
    await setRedis(alarm, location, cancel)
  }
  if (config.useDB) {
    await setDB(alarm, location, cancel)
  }
}

const getAlarmByCityId = async (cityId: string) => {
  const result = await mysqlService.getXZalarmCity(cityId)
  if (!result || !Array.isArray(result)) {
    return []
  }
  return {
    city_id: cityId,
    data: result.map(item => {
      delete item.city_id
      return item
    }),
    fetch_time: moment().format('YYYY-MM-DDTHH:mm:ssZ')
  }
}

const getAlarmList = async () => {
  const result = await mysqlService.getXZalarmAll()
  if (!result || !Array.isArray(result)) {
    return []
  }
  return {
    alarms: result.map(item => {
      item.cities = [item.city_id]
      delete item.city_id
      return item
    })
  }
}

const getAlarmAll = async () => {
  const result = await mysqlService.getXZalarmAll()
  if (!result || !Array.isArray(result)) {
    return []
  }
  const groupCity = groupBy(result, 'city_id')
  return {
    alarms: Object.keys(groupCity).map(item => {
      return {
        city_id: item,
        data: groupCity[item].map(item => {
          delete item.city_id
          return item
        }),
        fetch_time: moment().format('YYYY-MM-DDTHH:mm:ssZ')
      }
    })
  }
}

export default {
  setAlarm,
  getAlarmByCityId,
  getAlarmList,
  getAlarmAll
}
