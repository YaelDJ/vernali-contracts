/**
 * @vernali/contracts — IRouter, ILayer, IRouteHandler
 *
 * `IRouter.handle` is callable as an `IMiddlewareFn`,
 * which enables router nesting.
 */

import type { IContext } from './context.interface.js';
import type { IMiddlewareFn, Next } from './middleware.interface.js';

type MatchResult = {
  matched: boolean
  consumedPath: string
  params: Record<string, string>
}

export interface ILayer<T extends IContext = IContext> {
  path: string | RegExp;
  method: string | null;
  handlers: IMiddlewareFn<T>[];
  router: IRouter<T> | null;
  isRoute: boolean

  matches(pathName: string, method: string | undefined): MatchResult | null
}

export interface IRouter<T extends IContext = IContext> {
  use(path: string | RegExp | IRouter<T> | IMiddlewareFn<T>, ...handlers: IMiddlewareFn<T>[]): this;
  all(path: string | RegExp, ...handler: IMiddlewareFn<T>[]): this;
  register(method: string | null, path: string | RegExp, ...handlers: IMiddlewareFn<T>[]): this
  handle(ctx: T, next?: Next): Promise<void>;
  readonly stack: ILayer<T>[];
  [key: string]: any
}
