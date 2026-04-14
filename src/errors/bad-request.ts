/**
 * @vernali/contracts — BadRequestError (400)
 */

import { HttpException } from './http-exception.js';

export class BadRequestError extends HttpException {
  constructor(message: string = 'Bad Request') {
    super(400, message, 'Bad Request');
  }
}
