export default {
  env: 'production',
  useDB: true,
  useRedis: true,
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
        alarm: 'whenbot-12379-webhook'
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
        level: 'info'
      }
    }
  }
}
