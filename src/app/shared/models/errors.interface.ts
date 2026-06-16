export interface FieldError {
  field: string;
  message: string;
}

export interface DefaultError {
  status: number;
  message: string;
  timestamp: string;
}

export interface ValidationError extends DefaultError {
  errors: FieldError[];
}
