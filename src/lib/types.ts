export interface CatImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
}

export interface ApiSuccess<T> {
  data: T;
  success: true;
}

export interface ApiFailure {
  error: string;
  code: string;
  success: false;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface FavoriteCat extends CatImage {
  addedAt: number;
}
