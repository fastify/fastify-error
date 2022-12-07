declare function createError<C extends string, SC extends number>(code: C, message: string, statusCode: SC, Base?: Error): createError.FastifyErrorConstructor<{ code: C; statusCode: SC }>;
declare function createError<C extends string>(code: C, message: string, statusCode?: number, Base?: Error): createError.FastifyErrorConstructor<{ code: C; }>;

type CreateError = typeof createError;

declare namespace createError {
  export interface FastifyError extends Error {
    code: string;
    name: string;
    statusCode?: number;
  }

  export interface FastifyErrorConstructor<E extends { code: string; statusCode?: number } = { code: string; statusCode?: number }> {
    new (a?: any, b?: any, c?: any): FastifyError & E;
    (a?: any, b?: any, c?: any): FastifyError & E;
    readonly prototype: FastifyError & E;
  }

  export const createError: CreateError
  export { createError as default }
}

export = createError
