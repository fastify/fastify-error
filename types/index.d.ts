type CreateError = (code: string, message: string, statusCode?: number, Base?: Error) => createError.FastifyErrorConstructor

declare namespace createError {
  export interface FastifyError extends Error {
    code: string;
    name: string;
    statusCode?: number;
  }

  export interface FastifyErrorConstructor {
    new(a?: any, b?: any, c?: any): FastifyError;
    (a?: any, b?: any, c?: any): FastifyError;
    readonly prototype: FastifyError;
  }

  export const createError: CreateError
  export { createError as default }
}

declare function createError(...params: Parameters<CreateError>): ReturnType<CreateError>
export = createError
