import { logLevel as levels } from 'kafkajs';

export const LogCreator =
  (logLevel: unknown) =>
  ({ namespace, level, label, log }: any) => {
    // Example:
    const { timestamp, logger, message, ...others } = log;
    const data = `${namespace} - ${message} ${JSON.stringify(others)}`;
    switch (level) {
      case levels.ERROR:
      case levels.NOTHING:
        return console.error(data);
      case levels.WARN:
        return console.warn(data);
      case levels.INFO:
        return console.info(data);
      case levels.DEBUG:
        return console.debug(data);
    }
  };
