import logger from '../utils/logger';
import typeOrm from 'typeorm';

class DatabaseLogger implements typeOrm.Logger {
  logQuery(query: string, parameters?: unknown[]) {
    logger.debug(
      `${query} -- Parameters: ${this.stringifyParameters(parameters)}`,
    );
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    logger.error(
      `${query} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${error}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    logger.warn(
      `Time: ${time} -- Parameters: ${this.stringifyParameters(
        parameters,
      )} -- ${query}`,
    );
  }

  logMigration(message: string) {
    logger.debug(message);
  }

  logSchemaBuild(message: string) {
    logger.debug(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') {
      return logger.debug(message);
    }
    if (level === 'info') {
      return logger.info(message);
    }
    if (level === 'warn') {
      return logger.warn(message);
    }
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}

export default DatabaseLogger;
