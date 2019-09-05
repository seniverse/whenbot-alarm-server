import { Route } from '../../modules/types/server'
import * as controller from './controller'

export const baseUrl: string = '/v1/query'

const modules: Route[] = [
  {
    method: 'get',
    route: '/:cityId',
    handlers: [controller.queryCity]
  },
  {
    method: 'get',
    route: '/list',
    handlers: [controller.queryList]
  },
  {
    method: 'get',
    route: '/all',
    handlers: [controller.queryAll]
  }
]

export default modules
