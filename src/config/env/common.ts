export default {
  useDB: true,
  useRedis: true,
  appName: 'whenbot-alarm-receiver',
  serverName: 'whenbot-12306-receiver',
  port: 9527,
  services: {
    mysql: {
      host: 'localhost',
      user: 'root',
      port: '3306',
      database: 'whenbot-alarm',
      password: '123456'
    },
    redis: {
      host: '127.0.0.1',
      port: 6379,
      db: 7
    },
    mq: {
      source: 'redis',
      config: {},
      multi: 5,
      options: {
        MessageRetentionPeriod: 1800
      },
      queue: {
        alarm: 'whenbot-12379-webhook-test'
      }
    }
  },
  logger: {
    appenders: {
      cheese: {
        type: 'console'
      }
    },
    categories: {
      default: {
        appenders: ['cheese'],
        level: 'debug'
      }
    }
  }
}
