/**
 * @vernali/contracts — IApplication, IServerOptions
 *
 * Top-level application contract. Depends on IRouter and ILogger.
 */

import { IContext } from './context.interface.js';
import type { ILogger } from './logger.interface.js';
import type { IMiddlewareFn } from './middleware.interface.js';
import type { IRouter } from './router.interface.js';

export interface IServerOptions {
  port: number;
  hostname?: string;
}

export interface IApplication<T extends IContext = IContext> {
  readonly router: IRouter<T>;
  readonly logger: ILogger;
  use(...handlers: IMiddlewareFn<T>[]): this;
  get(path: string, ...handlers: IMiddlewareFn<T>[]): this;
  post(path: string, ...handlers: IMiddlewareFn<T>[]): this;
  put(path: string, ...handlers: IMiddlewareFn<T>[]): this;
  patch(path: string, ...handlers: IMiddlewareFn<T>[]): this;
  delete(path: string, ...handlers: IMiddlewareFn<T>[]): this;
  listen(options: IServerOptions, callback?: () => void): this;
  close(): Promise<void>;
  dispatch(ctx: T): Promise<void>
  serveStatic(rootDir: string, options?: any): IMiddlewareFn<T>
}
