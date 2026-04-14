/**
 * @vernali/contracts — IBodyParser, ParsedBody
 *
 * Body parser contract. ParsedBody is used by IContext
 * to represent the parsed request body.
 */

import type { IContext } from './context.interface.js';

export type ParsedBody = Record<string, unknown> | string | null;

export interface IBodyParser {
  parse(ctx: IContext): Promise<ParsedBody>;
}
