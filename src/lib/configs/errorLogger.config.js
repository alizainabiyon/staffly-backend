exports.errorLoggerConfig = {
  traceLogConfig: {
    appenders: {
      prod: { type: 'file', filename: './src/logs/trace.log' },
      dev: { type: 'console' },
    },
    categories: {
      prod: { appenders: ['prod'], level: 'trace' },
      dev: { appenders: ['dev'], level: 'trace' },
      default: { appenders: ['prod', 'dev'], level: 'trace' },
    },
  },
};
