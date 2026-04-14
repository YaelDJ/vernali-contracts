# @vernali/contracts

> Shared TypeScript interfaces and base error classes for the Vernali suite.

## Instalación

```bash
npm install @vernali/contracts
```

Requiere Node.js `>=18` y TypeScript `>=5.4`.

## Descripción

`@vernali/contracts` es el paquete central de contratos del ecosistema **Vernali**. Define las interfaces TypeScript y las clases de error base que deben ser implementadas por todos los paquetes del suite, garantizando coherencia arquitectónica y tipado estricto entre servicios.

El paquete es **zero-dependency** en producción: no tiene `dependencies` ni `peerDependencies`. Sólo consume `devDependencies` durante el desarrollo.

### Contratos exportados

| Contrato | Tipo | Descripción |
|---|---|---|
| `IApplication` | Interface | Contrato de aplicación de alto nivel (router, logger, listen, close) |
| `IServerOptions` | Interface | Opciones de arranque del servidor (`port`, `hostname`) |
| `IContext` | Interface | Estado del ciclo request/response de una petición HTTP |
| `IRouter` / `ILayer` | Interfaces | Enrutador y capa de ruta (GET, POST, PUT, PATCH, DELETE, use) |
| `IMiddleware` / `IMiddlewareFn` / `Next` | Types | Middlewares en estilo función y en estilo clase |
| `IBodyParser` / `ParsedBody` | Interface / Type | Contrato para parseo del cuerpo de la petición |
| `ILogger` / `ILogEntry` / `LogLevel` | Interfaces / Type | Logger con soporte de niveles y logger hijo por `requestId` |
| `IHttpError` | Interface | Forma base que deben cumplir todos los errores HTTP |
| `HttpException` | Class | Clase base concreta para errores HTTP |
| `NotFoundError` | Class | Error 404 Not Found |
| `UnauthorizedError` | Class | Error 401 Unauthorized |
| `BadRequestError` | Class | Error 400 Bad Request |
| `ForbiddenError` | Class | Error 403 Forbidden |
| `InternalServerError` | Class | Error 500 Internal Server Error |

---


## Dependencias

### Producción

Este paquete es **zero-dependency**. No requiere ninguna dependencia en tiempo de ejecución.

### Desarrollo

| Paquete | Versión | Propósito |
|---|---|---|
| `typescript` | `^5.4.0` | Compilador TypeScript |
| `vitest` | `^1.6.0` | Framework de testing |

### Configuración TypeScript relevante

El paquete utiliza una configuración TypeScript estricta orientada a módulos ESM nativos de Node.js:

| Opción | Valor | Motivo |
|---|---|---|
| `target` | `ES2022` | Soporte moderno de clases y `private` nativo |
| `module` | `NodeNext` | Módulos ESM/CJS con resolución nativa de Node.js |
| `moduleResolution` | `NodeNext` | Requiere extensiones explícitas en imports (`.js`) |
| `strict` | `true` | Tipado estricto completo |
| `noUncheckedIndexedAccess` | `true` | Acceso a índices devuelve `T \| undefined` |
| `exactOptionalPropertyTypes` | `true` | Distingue propiedad ausente de `undefined` explícito |
| `declaration` + `declarationMap` | `true` | Genera `.d.ts` y sus mapas de origen |

---

## Ejemplo básico

### Implementar un logger

```typescript
import type { ILogger, ILogEntry } from '@vernali/contracts';

class ConsoleLogger implements ILogger {
  debug(message: string, data?: Record<string, unknown>): void {
    console.debug({ level: 'debug', message, ...data });
  }
  info(message: string, data?: Record<string, unknown>): void {
    console.info({ level: 'info', message, ...data });
  }
  warn(message: string, data?: Record<string, unknown>): void {
    console.warn({ level: 'warn', message, ...data });
  }
  error(message: string, data?: Record<string, unknown>): void {
    console.error({ level: 'error', message, ...data });
  }
  child(requestId: string): ILogger {
    return new ScopedLogger(requestId, this);
  }
}
```

### Lanzar un error HTTP tipado

```typescript
import {
  HttpException,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  InternalServerError,
} from '@vernali/contracts';

// Error genérico con código personalizado
throw new HttpException(422, 'Unprocessable Entity', 'Validation Error');

// Errores semánticos predefinidos
throw new NotFoundError('Usuario no encontrado');
throw new UnauthorizedError('Token inválido');
throw new BadRequestError('El campo email es requerido');
throw new ForbiddenError('No tienes permisos para esta acción');
throw new InternalServerError('Error inesperado del servidor');
```

### Implementar un middleware

```typescript
import type { IMiddlewareFn } from '@vernali/contracts';

const requestLogger: IMiddlewareFn = async (ctx, next) => {
  console.log(`[${ctx.requestId}] ${ctx.method} ${ctx.path}`);
  await next();
};
```

### Implementar un router

```typescript
import type { IRouter, IContext, IMiddlewareFn, Next } from '@vernali/contracts';

class MyRouter implements IRouter {
  readonly stack = [];

  use(path: string, ...handlers: IMiddlewareFn[]): this { /* ... */ return this; }
  get(path: string, ...handlers: IMiddlewareFn[]): this { /* ... */ return this; }
  post(path: string, ...handlers: IMiddlewareFn[]): this { /* ... */ return this; }
  put(path: string, ...handlers: IMiddlewareFn[]): this { /* ... */ return this; }
  patch(path: string, ...handlers: IMiddlewareFn[]): this { /* ... */ return this; }
  delete(path: string, ...handlers: IMiddlewareFn[]): this { /* ... */ return this; }
  async handle(ctx: IContext, next: Next): Promise<void> { /* ... */ }
}
```

### Manejar errores HTTP en un middleware

```typescript
import type { IMiddlewareFn } from '@vernali/contracts';
import { HttpException } from '@vernali/contracts';

const errorHandler: IMiddlewareFn = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HttpException) {
      ctx.status(err.statusCode).json(err.toJSON());
    } else {
      ctx.status(500).json({ statusCode: 500, error: 'Internal Server Error', message: 'Unexpected error' });
    }
  }
};
```

---

## Licencia

ISC © 2026 **Vernali**

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
