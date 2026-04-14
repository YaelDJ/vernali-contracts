/**
 * @vernali/contracts — ForbiddenError (403)
 */

import { HttpException } from './http-exception.js';

export class ForbiddenError extends HttpException {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'Forbidden');
  }
}
