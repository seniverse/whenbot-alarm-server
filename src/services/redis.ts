import logger from '../utils/logger'
import getRedis from '../utils/redis'

const TTL = 2 * 24 * 60 * 60 // 2 days

const get = async (key: string) => {
  const redis = await getRedis()
  const dataStr = await redis.get(key)
  if (!dataStr) {
    return null
  }

  try {
    return JSON.parse(dataStr)
  } catch (e) {
    logger.debug(e)
    return null
  }
}

const set = async (key, value, ttl = TTL) => {
  const redis = await getRedis()
  const data = JSON.stringify(value)
  const result = await redis.set(key, data, 'EX', ttl)
  logger.debug(`[store][${key}:${ttl}] ${data}`)
  return result
}

export default {
  get,
  set
}
