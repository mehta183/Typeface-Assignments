import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, FileModel, PageResponse } from '../models/file.model';

@Injectable({ providedIn: 'root' })
export class FileService {
  private apiUrl = `${environment.apiUrl}/files`;
  constructor(private http: HttpClient) {}
  uploadFile(file: File): Observable<ApiResponse<FileModel>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<FileModel>>(this.apiUrl, formData);
  }
  getFiles(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<ApiResponse<PageResponse<FileModel>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    return this.http.get<ApiResponse<PageResponse<FileModel>>>(this.apiUrl, { params });
  }
  getFileById(id: number): Observable<ApiResponse<FileModel>> { return this.http.get<ApiResponse<FileModel>>(`${this.apiUrl}/${id}`); }
  downloadFile(id: number, fileName: string): Observable<Blob> { return this.http.get(`${this.apiUrl}/${id}/download`, { responseType: 'blob' }); }
  deleteFile(id: number): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`); }
  formatFileSize(bytes: number): string { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes','KB','MB','GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]; }
}
