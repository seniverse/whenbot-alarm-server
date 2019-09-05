import { Controller } from '../../modules/types/server'
import store from '../../services/store'

export const queryCity: Controller = async (ctx, next) => {
  const { cityId } = ctx.params
  const result = await store.getAlarmByCityId(cityId)
  ctx.body = {
    success: true,
    result
  }
  await next()
}

export const queryAll: Controller = async (ctx, next) => {
  const result = await store.getAlarmAll()
  ctx.body = {
    success: true,
    result
  }
  await next()
}

export const queryList: Controller = async (ctx, next) => {
  const result = await store.getAlarmList()
  ctx.body = {
    success: true,
    result
  }
  await next()
}
