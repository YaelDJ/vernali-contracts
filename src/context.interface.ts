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
  originalUrl: string;
  baseUrl: string;
  method: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  cookies: Record<string, string>;
  headers: Record<string, string | string[]>;
  body: ParsedBody;

  // Response
  readonly status: (code: number) => this;
  readonly json: (data: Record<string, unknown>) => void;
  readonly send: (body: string) => void;
  readonly html: (content: string) => void;
  readonly redirect: (url: string, code?: number) => void;
  readonly setHeader: (key: string, value: string) => this;

  // Metadata
  closed: boolean;
  requestId: string;
  state: Record<string, unknown>;
}
