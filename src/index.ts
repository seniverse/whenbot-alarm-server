import * as cors from '@koa/cors'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as koaJson from 'koa-json'
import * as koaLogger from 'koa-logger'

import config from './config'
import { errorMiddleware } from './middlewares/error'
import loggerMiddleware from './middlewares/logger'
import initRouter from './routers'
import logger from './utils/logger'

const app: any = new Koa()

app.name = config.serverName
app.proxy = true

app.use(
  cors({
    credentials: true,
    allowHeaders: ['Date', 'Content-Type', 'Authorization'],
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  })
)
app.use(koaJson())
app.use(bodyParser())
app.use(koaLogger())
app.use(errorMiddleware())
app.use(
  loggerMiddleware({
    whiteList: []
  })
)

initRouter(app)

const init = async () => {
  try {
    app.listen(config.port, () => {
      logger.info(`[SERVER ENV][${config.env}]`)
      logger.info(`[SERVER RUNNING][${config.port}]`)
    })
  } catch (err) {
    logger.error(`[ERROR][${err || err.stack}]`)
  }
}

init()

export default app
