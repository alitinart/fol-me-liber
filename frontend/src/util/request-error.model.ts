export interface ResponseError {
  status: string;
  title: string;
  message: string;
  timestamp: string;
}

export interface AxError {
  message: string;
  response?: {
    data: ResponseError;
    status: number;
  };
}
