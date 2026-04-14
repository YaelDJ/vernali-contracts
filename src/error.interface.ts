/**
 * @vernali/contracts — IHttpError interface
 *
 * Defines the shape that all HTTP error objects must satisfy.
 * Concrete implementations live in `./errors/`.
 */

export interface IHttpError {
  statusCode: number;
  message: string;
  toJSON(): { statusCode: number; error: string; message: string };
}
