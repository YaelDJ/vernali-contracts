/**
 * @vernali/contracts — IMiddleware, IMiddlewareFn, Next
 *
 * Both function-style and class-style middlewares are valid.
 * The compose engine accepts `IMiddlewareFn[]`.
 */

import type { IContext } from './context.interface.js';

export type Next = () => Promise<void>;

export type IMiddlewareFn = (ctx: IContext, next: Next) => Promise<void>;

export interface IMiddleware {
  handle: IMiddlewareFn;
}
