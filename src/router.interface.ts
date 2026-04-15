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

export interface ILayer {
  path: string | RegExp;
  method: string | null; // null = matches all methods (used by use())
  handlers: IMiddlewareFn[];
  router: IRouter | null;
  isRoute: boolean

  matches(pathName: string, method: string | undefined): MatchResult | null
}

export interface IRouter {
  use(path: string | RegExp | IRouter | IMiddlewareFn, ...handlers: IMiddlewareFn[]): this;
  all(path: string | RegExp, ...handler: IMiddlewareFn[]): this;
  register(method: string | null, path: string | RegExp, ...handlers: IMiddlewareFn[]): this
  handle(ctx: IContext, next?: Next): Promise<void>;
  readonly stack: ILayer[];
  [key: string]: any
}
