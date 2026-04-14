/**
 * @vernali/contracts — InternalServerError (500)
 */

import { HttpException } from './http-exception.js';

export class InternalServerError extends HttpException {
  constructor(message: string = 'Internal Server Error') {
    super(500, message, 'Internal Server Error');
  }
}
