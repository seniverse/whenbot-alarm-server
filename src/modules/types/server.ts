import * as Koa from 'koa'

export type Next = () => Promise<any>
export type Ctx = Koa.Context

export type Controller = (ctx: Ctx, next?: Next) => void

export interface RequestConfig {
  method: string
  url: RegExp
}

export interface Route {
  method: string
  route: string
  handlers: Controller[]
}

export interface RequestOptions {
  path?: string
  method?: string
  service?: string
  url?: string
  json?: boolean
  qs?: object
  body?: object
  headers?: object
  timeout?: number
  contentType?: string
}

interface Logger {
  readonly appenders: {
    readonly cheese: {
      readonly type: string
    }
  }
  readonly categories: {
    readonly default: {
      readonly appenders: string[]
      readonly level: string
    }
  }
}

export interface Config {
  env: string
  useDB: boolean
  useRedis: boolean
  appName: string
  serverName: string
  port: string | number
  services: {
    mysql: {
      host: string
      port: string
      user: string
      database: string
      password: string
    }
    redis: {
      host: string
      port: number
      db: string | number
      password: string
    }
    mq: {
      source: string
      config: object
      multi: number
      options: object
      queue: {
        alarm: string
      }
    }
  }
  logger: Logger
}
