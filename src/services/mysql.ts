import * as mysql from 'mysql2'
import config from '../config'
import logger from '../utils/logger'

const pool = mysql.createPool({
  host: config.services.mysql.host,
  port: config.services.mysql.port,
  user: config.services.mysql.user,
  database: config.services.mysql.database,
  password: config.services.mysql.password
})

const query = (sql: string, values?: any) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}

const createTable = (sql: string) => {
  return query(sql, [])
}

const XZ_ALARM = `create table if not exists xz_alarm(
    alarm_id VARCHAR(100) NOT NULL COMMENT '预警ID',
    title VARCHAR(500) NOT NULL COMMENT '标题',
    description VARCHAR(500) NOT NULL COMMENT '内容',
    level VARCHAR(100) NOT NULL COMMENT '等级',
    level_id VARCHAR(100) NOT NULL COMMENT '等级ID',
    pubdate VARCHAR(100) NOT NULL COMMENT '发布时间',
    pubunit VARCHAR(100) NOT NULL COMMENT '发布机构',
    type VARCHAR(100) NOT NULL DEFAULT '0' COMMENT '类型',
    type_id VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '类型ID',
    city_id VARCHAR(100) NOT NULL COMMENT '城市ID',
    PRIMARY KEY(alarm_id)
    );`

if (config.useDB) {
  createTable(XZ_ALARM)
}

const deleteAlarm = async (alarmId: string) => {
  const sql = `delete from xz_alarm where alarm_id="${alarmId}";`
  const result = await query(sql)
  logger.debug(`[MYSQL-DELETE]${alarmId}-${JSON.stringify(result)}`)
}

const insertAlarm = async (value: any) => {
  const sql =
    'insert into xz_alarm set alarm_id=?,title=?,description=?,level=?,level_id=?,pubdate=?,pubunit=?,type=?,type_id=?,city_id=?;'
  const result = await query(sql, Object.values(value))
  logger.debug(`[MYSQL-INSERT]${value.alarm_id}-${JSON.stringify(result)}`)
}

const getXZalarmAll = async () => {
  const sql = `select * from xz_alarm`
  const result = await query(sql)
  logger.debug(`[MYSQL-ALL-QUERY]-${JSON.stringify(result)}`)
  return result
}

const getXZalarmCity = async (cityId: string) => {
  const sql = `select * from xz_alarm where city_id = '${cityId}'`
  const result = await query(sql)
  logger.debug(`[MYSQL-CITYID-QUERY]${cityId}-${JSON.stringify(result)}`)
  return result
}

export default {
  deleteAlarm,
  insertAlarm,
  getXZalarmCity,
  getXZalarmAll
}
