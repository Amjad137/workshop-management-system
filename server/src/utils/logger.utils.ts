import rTracer from 'cls-rtracer';
import expressWinston from 'express-winston';
import { createLogger, format, LogEntry, transports } from 'winston';

import environment from '../config/env.config';

const { combine, timestamp, printf } = format;

const formatter = (logObject: LogEntry) => {
  const requestId = rTracer.id() as string;
  return requestId
    ? `[${environment.packageName}, ${requestId}] ${logObject.message}`
    : `[${environment.packageName}] ${logObject.message}`;
};

const rTracerFormat = printf(formatter);

const transportsList = [
  new transports.Http({
    level: 'info',
  }),
  new transports.Console(),
];

export const logger = createLogger({
  format: combine(timestamp(), rTracerFormat),
  transports: transportsList,
});

export const httpLogger = expressWinston.logger({
  format: combine(timestamp(), rTracerFormat),
  transports: transportsList,
  meta: true,
  expressFormat: true,
  colorize: true,
});

const formatLog = (msgs: unknown[]): string => {
  let formattedLog = '';

  try {
    for (const element of msgs) {
      const item = element;

      if (item === undefined) {
        return (formattedLog += ` undefined`);
      }

      const log = typeof item === 'object' ? JSON.stringify(item) : (item as string);
      formattedLog += ` ${log}`;
    }
  } catch (e) {
    return JSON.stringify(e);
  }

  return formattedLog;
};

console.log = (...msgs: unknown[]) => {
  const log = formatLog(msgs);
  const trace = rTracer.id() || '';
  logger.info(log, { trace: trace, service: environment.packageName });
};
