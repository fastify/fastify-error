export interface FastifyError extends Error {
  code: string
  statusCode?: number
  validation?: ValidationResult[]
}

export interface FastifyErrorConstructor extends ErrorConstructor {
  new(a?: any, b?: any, c?: any): FastifyError;
  (a?: any, b?: any, c?: any): FastifyError;
  readonly prototype: FastifyError;
}

export interface ValidationResult {
  keyword: string
  dataPath: string
  schemaPath: string
  params: Record<string, string | string[]>
  message: string
}

declare function createError (
  code: string,
  message: string,
  statusCode?: number,
  Base?: ErrorConstructor
): typeof FastifyError


export default createError;
export { createError };
