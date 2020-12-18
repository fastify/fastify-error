export = createError

declare function createError (
  code: string,
  message: string,
  statusCode?: number,
  Base?: Error
): createError.FastifyErrorConstructor

declare namespace createError {
  interface FastifyError extends Error {
    code: string;
    name: string;
    statusCode?: number;
  }
  interface FastifyErrorConstructor {
    new(a?: any, b?: any, c?: any): FastifyError;
    (a?: any, b?: any, c?: any): FastifyError;
    readonly prototype: FastifyError;
  }

  var FastifyError: FastifyErrorConstructor;
}
