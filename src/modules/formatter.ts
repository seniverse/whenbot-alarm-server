import * as moment from 'moment'
import { AlarmContent, Location } from '../modules/types/alarm'

const alarmBase = (alarm: AlarmContent) => {
  const {
    identifier,
    text,
    colorText,
    colorCode,
    date,
    eventId,
    title,
    regionId,
    eventName
  } = alarm
  return {
    alarm_id: identifier,
    title,
    description: text,
    level: colorText,
    level_id: colorCode,
    pubdate: date,
    pubunit: regionId,
    type: eventName,
    type_id: eventId
  }
}

const listBase = (
  alarm: AlarmContent,
  location: Location,
  alarmList: any,
  cancel = false,
  includeCity = false
) => {
  const { identifier, references } = alarm
  const listFilter = references
    ? alarmList.filter(alarm => alarm.alarm_id !== references)
    : alarmList.filter(alarm => alarm.alarm_id !== identifier)
  const newItem = cancel
    ? []
    : [
        Object.assign(
          alarmBase(alarm),
          includeCity ? { cities: [location.v3] } : {}
        )
      ]
  return listFilter.concat(newItem)
}

const formatAlarm = (
  alarm: AlarmContent,
  location: Location,
  cityAlarm: any,
  cancel = false
) => {
  const cityData = cityAlarm.data || []
  return {
    city_id: location.v3,
    data: listBase(alarm, location, cityData, cancel),
    fetch_time: moment().format('YYYY-MM-DDTHH:mm:ssZ')
  }
}

const formatList = (
  alarm: AlarmContent,
  location: Location,
  alarmList: any,
  cancel = false
) => {
  const list = alarmList.alarms || []
  return listBase(alarm, location, list, cancel, true)
}

const formatAll = (
  alarm: AlarmContent,
  location: Location,
  alarmCities: any,
  cancel = false
) => {
  const cities = alarmCities.alarms || []
  const cacheCity = cities.find(city => city.city_id === location.v3)
  if (cacheCity) {
    return cities
      .filter(city => city.city_id !== location.v3)
      .concat([
        {
          city_id: location.v3,
          data: listBase(alarm, location, cacheCity.data, cancel),
          fetch_time: moment().format('YYYY-MM-DDTHH:mm:ssZ')
        }
      ])
  } else {
    return cities.concat([
      {
        city_id: location.v3,
        data: listBase(alarm, location, [], cancel),
        fetch_time: moment().format('YYYY-MM-DDTHH:mm:ssZ')
      }
    ])
  }
}

export default {
  alarmBase,
  formatAlarm,
  formatList,
  formatAll
}
