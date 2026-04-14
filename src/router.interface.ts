/**
 * @vernali/contracts — IRouter, ILayer, IRouteHandler
 *
 * `IRouter.handle` is callable as an `IMiddlewareFn`,
 * which enables router nesting.
 */

import type { IContext } from './context.interface.js';
import type { IMiddlewareFn, Next } from './middleware.interface.js';

export interface ILayer {
  path: string | RegExp;
  method: string | null; // null = matches all methods (used by use())
  handler: IMiddlewareFn;
}

export interface IRouter {
  use(path: string, ...handlers: IMiddlewareFn[]): this;
  get(path: string, ...handlers: IMiddlewareFn[]): this;
  post(path: string, ...handlers: IMiddlewareFn[]): this;
  put(path: string, ...handlers: IMiddlewareFn[]): this;
  patch(path: string, ...handlers: IMiddlewareFn[]): this;
  delete(path: string, ...handlers: IMiddlewareFn[]): this;
  handle(ctx: IContext, next: Next): Promise<void>;
  readonly stack: ILayer[];
}
