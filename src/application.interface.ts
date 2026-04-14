/**
 * @vernali/contracts — IApplication, IServerOptions
 *
 * Top-level application contract. Depends on IRouter and ILogger.
 */

import type { ILogger } from './logger.interface.js';
import type { IMiddlewareFn } from './middleware.interface.js';
import type { IRouter } from './router.interface.js';

export interface IServerOptions {
  port: number;
  hostname?: string;
}

export interface IApplication {
  readonly router: IRouter;
  readonly logger: ILogger;
  use(...handlers: IMiddlewareFn[]): this;
  listen(options: IServerOptions, callback?: () => void): this;
  close(): Promise<void>;
}
