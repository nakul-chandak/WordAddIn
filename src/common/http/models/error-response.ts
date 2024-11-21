export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export interface CustomError {
  name?: string;
  message?: string;
  statusCode?: number;
}

