/**
 * @vernali/contracts — IApplication, IServerOptions
 *
 * Top-level application contract. Depends on IRouter and ILogger.
 */

import { IContext } from './context.interface.js';
import type { ILogger } from './logger.interface.js';
import type { IMiddlewareFn, Next } from './middleware.interface.js';
import type { IRouter } from './router.interface.js';

export interface IServerOptions {
  port: number;
  hostname?: string;
}

export interface IApplication {
  readonly router: IRouter;
  readonly logger: ILogger;
  use(...handlers: IMiddlewareFn[]): this;
  get(path: string, ...handlers: IMiddlewareFn[]): this;
  post(path: string, ...handlers: IMiddlewareFn[]): this;
  put(path: string, ...handlers: IMiddlewareFn[]): this;
  patch(path: string, ...handlers: IMiddlewareFn[]): this;
  delete(path: string, ...handlers: IMiddlewareFn[]): this;
  listen(options: IServerOptions, callback?: () => void): this;
  close(): Promise<void>;
  dispatch(ctx: IContext): Promise<void>
  serveStatic(rootDir: string, options?: any): IMiddlewareFn
}
