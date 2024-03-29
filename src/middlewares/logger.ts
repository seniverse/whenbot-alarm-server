import { Controller, Ctx, RequestConfig } from '../modules/types/server'
import logger from '../utils/logger'

export const isTargetRequest = (ctx: Ctx, whiteList: RequestConfig[]) => {
  const method = ctx.request.method.toUpperCase()
  const { url } = ctx.request
  const checked = whiteList.some(
    option => option.method === method && option.url.test(url)
  )
  if (checked) {
    logger.info(`[WHITELIST][method:${method}] ${url}`)
  }
  return checked
}

const loggerMiddleware = (options: {
  whiteList: RequestConfig[]
}): Controller => async (ctx, next) => {
  const { whiteList } = options
  const checkWhite = await isTargetRequest(ctx, whiteList)
  if (checkWhite) {
    return await next()
  }

  const url = ctx.request.URL
  const { pathname } = url

  logger.info(
    [
      `[path] ${pathname}`,
      `[method] ${ctx.request.method}`,
      `[IP] ${ctx.request.ip}`,
      `[query] ${JSON.stringify(ctx.query)}`,
      `[body] ${JSON.stringify(ctx.request.body)}`
    ].join('\n')
  )
  await next()
}

export default loggerMiddleware
