export interface FileModel {
  id: number;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileExtension: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
