/**
 * @vernali/contracts — IMiddleware, IMiddlewareFn, Next
 *
 * Both function-style and class-style middlewares are valid.
 * The compose engine accepts `IMiddlewareFn[]`.
 */

import type { IContext } from './context.interface.js';

export type Next = () => Promise<void>;

export type IMiddlewareFn<T extends IContext = IContext> =
  | ((ctx: T) => void | Promise<void>)
  | ((ctx: T, next: Next) => void | Promise<void>);

export interface IMiddleware<T extends IContext = IContext> {
  handle: IMiddlewareFn<T>;
}
