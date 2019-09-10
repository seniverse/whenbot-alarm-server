import { Route } from '../../modules/types/server'
import check from '../shared/check'
import * as controller from './controller'

export const baseUrl: string = '/v1/webhook'

const modules: Route[] = [
  {
    method: 'post',
    route: '/',
    handlers: [check.body(['location', 'data']), controller.checkContent]
  }
]

export default modules
