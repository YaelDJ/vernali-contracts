/**
 * @vernali/contracts — ILogger, LogLevel, ILogEntry
 *
 * Logger contract for the Vernali suite.
 * `child(requestId)` creates a scoped logger that attaches
 * the requestId to every log entry automatically.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogEntry {
  level: LogLevel;
  message: string;
  requestId?: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface ILogger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
  child(requestId: string): ILogger;
}
