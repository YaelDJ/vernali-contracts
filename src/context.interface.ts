/**
 * @vernali/contracts — IContext
 *
 * Represents the state of a single HTTP request/response cycle.
 * Focused on req/res only — logger is NOT included here
 * (injected via `ctx.state` or a dedicated middleware).
 */

import type { ParsedBody } from './body.interface.js';

export interface IContext {
  // Request
  readonly method: string;
  readonly path: string;
  readonly params: Record<string, string>;
  readonly query: Record<string, string>;
  readonly headers: Record<string, string | string[]>;
  body: ParsedBody;

  // Response
  readonly status: (code: number) => this;
  readonly json: (data: unknown) => void;
  readonly send: (body: string) => void;
  readonly html: (content: string) => void;
  readonly redirect: (url: string, code?: number) => void;
  readonly setHeader: (key: string, value: string) => this;

  // Metadata
  readonly requestId: string;
  readonly state: Record<string, unknown>;
}
