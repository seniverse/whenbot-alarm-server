import * as merge from 'object-merge'
import { Config } from '../modules/types/server'

const env: string = process.env.NODE_ENV || 'local'

const common: Config = require('./env/common').default
const config: Config = require(`./env/${env}`).default

const mergedConfig = merge({}, common, config)

export default mergedConfig as Config
