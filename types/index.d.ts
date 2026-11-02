declare function createError<C extends string, SC extends number, Arg extends unknown[] = [any?, any?, any?]> (
  code: C,
  message: string,
  statusCode: SC,
  Base?: ErrorConstructor,
  captureStackTrace?: boolean
): createError.FastifyErrorConstructor<{ code: C, statusCode: SC }, Arg>

declare function createError<C extends string, Arg extends unknown[] = [any?, any?, any?]> (
  code: C,
  message: string,
  statusCode?: number,
  Base?: ErrorConstructor,
  captureStackTrace?: boolean
): createError.FastifyErrorConstructor<{ code: C }, Arg>

declare function createError<Arg extends unknown[] = [any?, any?, any?]> (
  code: string,
  message: string,
  statusCode?: number,
  Base?: ErrorConstructor,
  captureStackTrace?: boolean
): createError.FastifyErrorConstructor<{ code: string }, Arg>

type CreateError = typeof createError

declare namespace createError {
  export interface FastifyError extends Error {
    code: string
    name: string
    statusCode?: number,
    toRFC7807?(instance?: string, details?: Record<string, any>): RFC7807Problem

  }

  export interface FastifyErrorConstructor<
    E extends { code: string, statusCode?: number } = { code: string, statusCode?: number },
    T extends unknown[] = [any?, any?, any?]
  > {
    new(...arg: T): FastifyError & E
    (...arg: T): FastifyError & E
    readonly prototype: FastifyError & E
  }

  export function createRFC7807Error<
  C extends string,
  SC extends number,
  Arg extends unknown[] = [any?, any?, any?]
> (
    code: C,
    message: string,
    statusCode?: SC,
    opts?: { type?: string; title?: string },
    Base?: ErrorConstructor,
    captureStackTrace?: boolean
  ): createError.FastifyErrorConstructor<{ code: C; statusCode: SC }, Arg>

  export interface RFC7807Problem {
    type: string
    title: string
    status: number
    detail: string
    instance?: string
    code: string
    details?: Record<string, unknown>
  }

  export const FastifyError: FastifyErrorConstructor

  export const createError: CreateError
  export { createError as default }
}

export = createError
