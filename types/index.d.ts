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
    statusCode?: number
  }

  export interface FastifyErrorConstructor<
    E extends { code: string, statusCode?: number } = { code: string, statusCode?: number },
    T extends unknown[] = [any?, any?, any?]
  > {
    new(...arg: T): FastifyError & E
    (...arg: T): FastifyError & E
    readonly prototype: FastifyError & E
  }

  export interface RFC9457ErrorOptions {
    type?: string
    title?: string
  }

  export interface RFC9457ProblemDetails {
    type: string
    title: string
    status: number
    detail: string
    instance: string
    code: string
    details: Record<string, unknown>
  }

  export interface RFC9457Error extends FastifyError {
    toProblemDetails(instance?: string, details?: Record<string, unknown>): RFC9457ProblemDetails
  }

  export interface RFC9457ErrorConstructor<
    E extends { code: string, statusCode?: number } = { code: string, statusCode?: number },
    T extends unknown[] = [any?, any?, any?]
  > {
    new(...arg: T): RFC9457Error & E
    (...arg: T): RFC9457Error & E
    readonly prototype: RFC9457Error & E
  }

  export const FastifyError: FastifyErrorConstructor

  export function createRFC9457Error<C extends string, SC extends number, Arg extends unknown[] = [any?, any?, any?]> (
    code: C,
    message: string,
    statusCode: SC,
    opts?: RFC9457ErrorOptions,
    Base?: ErrorConstructor,
    captureStackTrace?: boolean
  ): RFC9457ErrorConstructor<{ code: C, statusCode: SC }, Arg>

  export function createRFC9457Error<C extends string, Arg extends unknown[] = [any?, any?, any?]> (
    code: C,
    message: string,
    statusCode?: number,
    opts?: RFC9457ErrorOptions,
    Base?: ErrorConstructor,
    captureStackTrace?: boolean
  ): RFC9457ErrorConstructor<{ code: C }, Arg>

  export function createRFC9457Error<Arg extends unknown[] = [any?, any?, any?]> (
    code: string,
    message: string,
    statusCode?: number,
    opts?: RFC9457ErrorOptions,
    Base?: ErrorConstructor,
    captureStackTrace?: boolean
  ): RFC9457ErrorConstructor<{ code: string }, Arg>

  export const createError: CreateError
  export { createError as default }
}

export = createError
