const pino = require('pino');

const getLogger = (isExtreme = true, options) => {
  if (isExtreme) {
    const dest = pino.extreme();
    const logger = pino(dest);

    // asynchronously flush every 10 seconds to keep the buffer empty
    // in periods of low activity
    setInterval(() => {
      logger.flush();
    }, 10000).unref();

    // use pino.final to create a special logger that
    // guarantees final tick writes
    const handler = pino.final(logger, (err, finalLogger, evt) => {
      finalLogger.info(`${evt} caught`);
      if (err) finalLogger.error(err, 'error caused exit');
      process.exit(err ? 1 : 0);
    });

    // catch all the ways node might exit
    process.on('beforeExit', () => handler(null, 'beforeExit'));
    process.on('exit', () => handler(null, 'exit'));
    process.on('uncaughtException', err => handler(err, 'uncaughtException'));
    process.on('SIGINT', () => handler(null, 'SIGINT'));
    process.on('SIGQUIT', () => handler(null, 'SIGQUIT'));
    process.on('SIGTERM', () => handler(null, 'SIGTERM'));

    return logger;
  }
  return pino(options);
};

module.exports = getLogger;
