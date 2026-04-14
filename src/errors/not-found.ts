/**
 * @vernali/contracts — NotFoundError (404)
 */

import { HttpException } from './http-exception.js';

export class NotFoundError extends HttpException {
  constructor(message: string = 'Not Found') {
    super(404, message, 'Not Found');
  }
}
