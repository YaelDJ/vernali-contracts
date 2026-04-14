/**
 * @vernali/contracts — Public API
 *
 * Re-exports all interfaces, types, and error classes.
 * This is the single entry point for consumers.
 */

// ── Error interface & concrete classes ──────────────────────────────
export type { IHttpError } from './error.interface.js';
export { HttpException } from './errors/http-exception.js';
export { NotFoundError } from './errors/not-found.js';
export { UnauthorizedError } from './errors/unauthorized.js';
export { BadRequestError } from './errors/bad-request.js';
export { ForbiddenError } from './errors/forbidden.js';
export { InternalServerError } from './errors/internal.js';

// ── Logger ──────────────────────────────────────────────────────────
export type { ILogger, ILogEntry, LogLevel } from './logger.interface.js';

// ── Body parser ─────────────────────────────────────────────────────
export type { IBodyParser, ParsedBody } from './body.interface.js';

// ── Context ─────────────────────────────────────────────────────────
export type { IContext } from './context.interface.js';

// ── Middleware ───────────────────────────────────────────────────────
export type { IMiddleware, IMiddlewareFn, Next } from './middleware.interface.js';

// ── Router ──────────────────────────────────────────────────────────
export type { IRouter, ILayer } from './router.interface.js';

// ── Application ─────────────────────────────────────────────────────
export type { IApplication, IServerOptions } from './application.interface.js';
