/**
 * @vernali/contracts — HttpException base class
 *
 * The only concrete base class allowed in this package.
 * Uses `Object.setPrototypeOf` to fix `instanceof` checks
 * when targeting ES2022 with class inheritance.
 */

import type { IHttpError } from '../error.interface.js';

export class HttpException extends Error implements IHttpError {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly error: string = 'HTTP Error',
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): { statusCode: number; error: string; message: string } {
    return {
      statusCode: this.statusCode,
      error: this.error,
      message: this.message,
    };
  }
}
