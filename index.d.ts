export interface FastifyError extends Error {
  new(): FastifyError
  code: string
  statusCode?: number
  validation?: ValidationResult[]
}

export interface ValidationResult {
  keyword: string
  dataPath: string
  schemaPath: string
  params: Record<string, string>
  message: string
}

declare function createError (
  code: string,
  message: string,
  statusCode?: number,
  Base?: Error
): FastifyError


export default createError
