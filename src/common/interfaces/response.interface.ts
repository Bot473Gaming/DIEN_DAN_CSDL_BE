export interface ResponseData<T> {
  message?: string;
  data: T;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  timestamp: string;
  path: string;
  message: string;
  data: T;
}
