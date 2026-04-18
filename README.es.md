# @vernali/contracts

> Interfaces TypeScript y clases de error base compartidas por todo el ecosistema Vernali.

## Instalación

```bash
npm install @vernali/contracts
```

Requiere Node.js `>=18` y TypeScript `>=5.4`.

## Descripción

`@vernali/contracts` es el paquete de contratos del ecosistema **Vernali**. Contiene exclusivamente interfaces TypeScript, types y clases de error base que todos los paquetes del suite deben implementar. Centralizar estos contratos garantiza coherencia arquitectónica y tipado estricto entre servicios, sin introducir acoplamiento entre implementaciones concretas.

El paquete es **zero-dependency** en producción: no declara `dependencies` ni `peerDependencies`. El compilador de TypeScript es la única dependencia de desarrollo.

### Contratos exportados

| Contrato | Tipo | Descripción |
|---|---|---|
| `IApplication` | Interface | Contrato de aplicación: enrutamiento, middleware, `dispatch` y archivos estáticos |
| `IServerOptions` | Interface | Parámetros de red del servidor (`port`, `hostname`) |
| `IContext` | Interface | Estado del ciclo request/response de una petición HTTP |
| `IRouter` / `ILayer` | Interfaces | Enrutador y unidad de ruta: registro, matching y ejecución del stack |
| `IMiddleware` / `IMiddlewareFn` / `Next` | Types | Firma de middlewares funcionales o de clase; `next` es opcional |
| `IBodyParser` / `ParsedBody` | Interface / Type | Contrato de extracción y tipado del cuerpo de la petición |
| `ILogger` / `ILogEntry` / `LogLevel` | Interfaces / Type | Logger con niveles de severidad y loggers hijos por `requestId` |
| `IHttpError` | Interface | Forma que deben satisfacer todos los errores HTTP |
| `HttpException` | Class | Clase base concreta para errores HTTP |
| `NotFoundError` | Class | Error 404 Not Found |
| `UnauthorizedError` | Class | Error 401 Unauthorized |
| `BadRequestError` | Class | Error 400 Bad Request |
| `ForbiddenError` | Class | Error 403 Forbidden |
| `InternalServerError` | Class | Error 500 Internal Server Error |

---

## Dependencias

### Producción

Este paquete no tiene dependencias en tiempo de ejecución.

### Desarrollo

| Paquete | Versión | Propósito |
|---|---|---|
| `typescript` | `^5.4.0` | Compilador TypeScript |
| `vitest` | `^1.6.0` | Framework de testing |

### Configuración TypeScript

El paquete se compila con una configuración orientada a módulos ESM nativos de Node.js:

| Opción | Valor | Efecto |
|---|---|---|
| `target` | `ES2022` | Habilita campos privados nativos y la semántica de clases de ES2022 |
| `module` | `NodeNext` | Resolución híbrida ESM/CJS siguiendo la lógica de Node.js |
| `moduleResolution` | `NodeNext` | Los imports deben incluir la extensión explícita `.js` |
| `strict` | `true` | Activa todas las comprobaciones de tipo estrictas |
| `noUncheckedIndexedAccess` | `true` | El acceso a índices produce `T \| undefined` |
| `exactOptionalPropertyTypes` | `true` | Distingue entre propiedad ausente y `undefined` explícito |
| `declaration` + `declarationMap` | `true` | Emite `.d.ts` con mapas de origen para navegación en IDEs |

---

## Ejemplos de uso

### Lanzar un error HTTP

`HttpException` es la clase base de todos los errores HTTP. Las subclases predefinidas cubren los códigos más comunes; para cualquier otro código se instancia `HttpException` directamente.

```typescript
import { HttpException, NotFoundError } from '@vernali/contracts';

// Subclase semántica: emite automáticamente el código y el texto de estado
throw new NotFoundError('El recurso solicitado no existe');

// Clase base: código, mensaje y nombre del error configurables
throw new HttpException(422, 'El campo "email" no es válido', 'Unprocessable Entity');
```

Todos los errores exponen `toJSON()`, que serializa `{ statusCode, error, message }` —listo para enviarse como cuerpo de respuesta.

---

### Implementar un middleware

`IMiddlewareFn<T>` admite dos firmas: con `next` (para continuar la cadena) o sin él (para terminar el ciclo directamente). Ambas son equivalentes desde el punto de vista del motor de composición.

```typescript
import type { IMiddlewareFn } from '@vernali/contracts';

// Sin next: el handler responde y termina el ciclo
const healthCheck: IMiddlewareFn = async (ctx) => {
  ctx.status(200).json({ status: 'ok' });
};

// Con next: ejecuta lógica propia y delega al siguiente middleware
const requestLogger: IMiddlewareFn = async (ctx, next) => {
  const start = Date.now();
  await next();
  console.log(`${ctx.method} ${ctx.path} — ${Date.now() - start}ms`);
};
```

---

### Implementar un Router

`IRouter<T>` define el contrato que debe satisfacer cualquier implementación de enrutador. El método `handle` tiene la misma firma que `IMiddlewareFn`, lo que permite anidar routers en otros routers o en la aplicación sin adaptadores adicionales.

```typescript
import type { IRouter, ILayer, IContext, IMiddlewareFn, Next } from '@vernali/contracts';

class MyRouter implements IRouter {
  readonly stack: ILayer[] = [];

  // Registra middlewares sueltos, sub-routers o rutas sin método
  use(path: string | RegExp | IRouter | IMiddlewareFn, ...handlers: IMiddlewareFn[]): this {
    return this;
  }

  // Punto de entrada unificado para registrar una capa en el stack
  register(method: string | null, path: string | RegExp, ...handlers: IMiddlewareFn[]): this {
    return this;
  }

  // Coincide con todas las peticiones independientemente del método HTTP
  all(path: string | RegExp, ...handlers: IMiddlewareFn[]): this {
    return this.register(null, path, ...handlers);
  }

  get(path: string, ...handlers: IMiddlewareFn[]): this {
    return this.register('GET', path, ...handlers);
  }

  // Ejecuta el stack de middlewares; next es opcional para permitir anidamiento
  async handle(ctx: IContext, next?: Next): Promise<void> {
    if (next) await next();
  }
}
```

---

### Extender el contexto mediante genéricos

Todas las interfaces principales —`IMiddlewareFn`, `IRouter`, `IApplication`— son genéricas sobre `T extends IContext`. Esto permite añadir propiedades al contexto y propagar ese tipado a través de toda la pila de middlewares sin casteos explícitos.

```typescript
import type { IContext, IMiddlewareFn, IApplication } from '@vernali/contracts';

// Contexto extendido con datos de autenticación y configuración
interface AppContext extends IContext {
  user?: { id: string; role: 'admin' | 'user' };
  config: Record<string, string>;
}

// El tipo de ctx refleja AppContext en todos los middlewares parametrizados
const requireAuth: IMiddlewareFn<AppContext> = async (ctx, next) => {
  if (!ctx.user) throw new Error('Unauthenticated');
  await next();
};

// La aplicación queda vinculada al mismo tipo de contexto
declare const app: IApplication<AppContext>;
app.use(requireAuth);
```
