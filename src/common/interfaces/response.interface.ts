export interface ResponseData<T> {
  message?: string;
  data: T;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  method: string;
  timestamp: string;
  path: string;
  message: string;
  data: T;
}
