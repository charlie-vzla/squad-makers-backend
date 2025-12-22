import winston from 'winston';
import ElasticsearchTransport from 'winston-elasticsearch';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const NODE_ENV = process.env.NODE_ENV || 'development';
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Format for Elasticsearch
const elasticsearchFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create transports array
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: consoleFormat,
    level: LOG_LEVEL,
  }),
];

// Add Elasticsearch transport only in non-test environments
if (NODE_ENV !== 'test') {
  const esTransportOpts = {
    level: 'info',
    clientOpts: {
      node: ELASTICSEARCH_URL,
    },
    index: 'logs',
    format: elasticsearchFormat,
  };

  transports.push(new ElasticsearchTransport(esTransportOpts));
}

// Create logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL,
  transports,
  exceptionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

export default logger;
