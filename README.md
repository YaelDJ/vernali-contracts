# @vernali/contracts

> Shared TypeScript interfaces and base error classes for the entire Vernali ecosystem.

## Installation

```bash
npm install @vernali/contracts
```

Requires Node.js `>=18` and TypeScript `>=5.4`.

## Overview

`@vernali/contracts` is the contracts package for the **Vernali** ecosystem. It contains exclusively TypeScript interfaces, types, and base error classes that every package in the suite must implement. Centralising these contracts enforces architectural consistency and strict typing across services without introducing coupling between concrete implementations.

The package is **zero-dependency** in production: it declares no `dependencies` or `peerDependencies`. The TypeScript compiler is the only development dependency.

### Exported contracts

| Contract | Kind | Description |
|---|---|---|
| `IApplication` | Interface | Application contract: routing, middleware, `dispatch`, and static file serving |
| `IServerOptions` | Interface | Server network parameters (`port`, `hostname`) |
| `IContext` | Interface | State of a single HTTP request/response cycle |
| `IRouter` / `ILayer` | Interfaces | Router and route unit: registration, matching, and stack execution |
| `IMiddleware` / `IMiddlewareFn` / `Next` | Types | Signature for function-style or class-style middlewares; `next` is optional |
| `IBodyParser` / `ParsedBody` | Interface / Type | Contract for extracting and typing the request body |
| `ILogger` / `ILogEntry` / `LogLevel` | Interfaces / Type | Logger with severity levels and scoped child loggers per `requestId` |
| `IHttpError` | Interface | Shape that all HTTP error objects must satisfy |
| `HttpException` | Class | Concrete base class for HTTP errors |
| `NotFoundError` | Class | 404 Not Found |
| `UnauthorizedError` | Class | 401 Unauthorized |
| `BadRequestError` | Class | 400 Bad Request |
| `ForbiddenError` | Class | 403 Forbidden |
| `InternalServerError` | Class | 500 Internal Server Error |

---

## Dependencies

### Production

This package has no runtime dependencies.

### Development

| Package | Version | Purpose |
|---|---|---|
| `typescript` | `^5.4.0` | TypeScript compiler |
| `vitest` | `^1.6.0` | Testing framework |

### TypeScript configuration

The package compiles with a configuration targeting native ESM modules on Node.js:

| Option | Value | Effect |
|---|---|---|
| `target` | `ES2022` | Enables native private fields and ES2022 class semantics |
| `module` | `NodeNext` | Hybrid ESM/CJS resolution following Node.js module rules |
| `moduleResolution` | `NodeNext` | Imports must include the explicit `.js` extension |
| `strict` | `true` | Enables all strict type-checking rules |
| `noUncheckedIndexedAccess` | `true` | Index access yields `T \| undefined` |
| `exactOptionalPropertyTypes` | `true` | Distinguishes between an absent property and an explicit `undefined` |
| `declaration` + `declarationMap` | `true` | Emits `.d.ts` files with source maps for IDE navigation |

---

## Usage

### Throwing an HTTP error

`HttpException` is the base class for all HTTP errors. The predefined subclasses cover the most common status codes; for any other code, instantiate `HttpException` directly.

```typescript
import { HttpException, NotFoundError } from '@vernali/contracts';

// Semantic subclass: status code and status text are set automatically
throw new NotFoundError('The requested resource does not exist');

// Base class: status code, message, and error name are fully configurable
throw new HttpException(422, 'The "email" field is not valid', 'Unprocessable Entity');
```

All errors expose `toJSON()`, which serialises `{ statusCode, error, message }` — ready to be sent as a response body.

---

### Implementing a middleware

`IMiddlewareFn<T>` accepts two signatures: with `next` (to continue the chain) or without it (to terminate the cycle immediately). Both are equivalent from the composition engine's perspective.

```typescript
import type { IMiddlewareFn } from '@vernali/contracts';

// Without next: the handler responds and ends the cycle
const healthCheck: IMiddlewareFn = async (ctx) => {
  ctx.status(200).json({ status: 'ok' });
};

// With next: runs its own logic and delegates to the next middleware
const requestLogger: IMiddlewareFn = async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`${ctx.method} ${ctx.path} — ${Date.now() - start}ms`);
};
```

---

### Implementing a Router

`IRouter<T>` defines the contract any router implementation must satisfy. The `handle` method shares the same signature as `IMiddlewareFn`, which allows routers to be nested inside other routers or the application without additional adapters.

```typescript
import type { IRouter, ILayer, IContext, IMiddlewareFn, Next } from '@vernali/contracts';

class MyRouter implements IRouter {
  readonly stack: ILayer[] = [];

  // Registers loose middlewares, sub-routers, or method-agnostic routes
  use(path: string | RegExp | IRouter | IMiddlewareFn, ...handlers: IMiddlewareFn[]): this {
    return this;
  }

  // Unified entry point for adding a layer to the stack
  register(method: string | null, path: string | RegExp, ...handlers: IMiddlewareFn[]): this {
    return this;
  }

  // Matches all requests regardless of HTTP method
  all(path: string | RegExp, ...handlers: IMiddlewareFn[]): this {
    return this.register(null, path, ...handlers);
  }

  get(path: string, ...handlers: IMiddlewareFn[]): this {
    return this.register('GET', path, ...handlers);
  }

  // Executes the middleware stack; next is optional to allow nesting
  async handle(ctx: IContext, next?: Next): Promise<void> {
    if (next) await next();
  }
}
```

---

### Extending the context with generics

All primary interfaces — `IMiddlewareFn`, `IRouter`, `IApplication` — are generic over `T extends IContext`. This allows additional properties to be added to the context and that typing to be propagated through the entire middleware stack without explicit casts.

```typescript
import type { IContext, IMiddlewareFn, IApplication } from '@vernali/contracts';

// Extended context carrying authentication data and runtime configuration
interface AppContext extends IContext {
  user?: { id: string; role: 'admin' | 'user' };
  config: Record<string, string>;
}

// ctx is typed as AppContext in all parametrised middlewares
const requireAuth: IMiddlewareFn<AppContext> = async (ctx, next) => {
  if (!ctx.user) throw new Error('Unauthenticated');
  await next();
};

// The application is bound to the same context type
declare const app: IApplication<AppContext>;
app.use(requireAuth);
```
