/**
 * @vernali/contracts — UnauthorizedError (401)
 */

import { HttpException } from './http-exception.js';

export class UnauthorizedError extends HttpException {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'Unauthorized');
  }
}
