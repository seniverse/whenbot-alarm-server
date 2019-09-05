import * as IoRedis from 'ioredis'
import config from '../config'
import logger from '../utils/logger'

let instance = null

async function getRedis(
  keyPrefix = `${config.appName}.`
): Promise<IoRedis.Redis> {
  if (instance) {
    return instance
  }

  const dbConf = Object.assign({}, config.services.redis, {})
  logger.info(`[Redis:connection] ${JSON.stringify(dbConf)}`)
  instance = await new IoRedis(dbConf)
  return instance
}

export default getRedis
