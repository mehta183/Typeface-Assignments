import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FileModel, PageResponse } from '../../../core/models/file.model';
import { FileService } from '../../../core/services/file.service';
import * as FileActions from '../../../store/actions/file.actions';
import * as FileSelectors from '../../../store/selectors/file.selectors';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="file-list-container">
  <div class="header">
    <h1>My Files</h1>
    <button (click)="openUploadModal()" class="btn-upload"> + Upload File </button>
  </div>
  <div *ngIf="loading$ | async" class="loading">Loading...</div>
  <div *ngIf="files$ | async as filesData" class="files-grid">
    <div *ngFor="let file of filesData.content" class="file-card">
      <div class="file-icon"> <span>{{ getFileIcon(file.fileExtension) }}</span> </div>
      <div class="file-info">
        <h3>{{ file.originalFileName }}</h3>
        <p>{{ formatFileSize(file.fileSize) }}</p>
        <p class="file-meta">Downloads: {{ file.downloadCount }}</p>
        <p class="file-meta">{{ formatDate(file.createdAt) }}</p>
      </div>
      <div class="file-actions">
        <button (click)="downloadFile(file)" class="btn-action">Download</button>
        <button (click)="viewFile(file)" class="btn-action">View</button>
        <button (click)="deleteFile(file.id)" class="btn-danger">Delete</button>
      </div>
    </div>
    <div *ngIf="filesData.content.length === 0" class="empty-state">
      <p>No files uploaded yet</p>
      <button (click)="openUploadModal()" class="btn-upload">Upload your first file</button>
    </div>
  </div>
  <div *ngIf="files$ | async as filesData" class="pagination">
    <button (click)="previousPage()" [disabled]="filesData.first" class="btn-page">Previous</button>
    <span>Page {{ filesData.pageNumber + 1 }} of {{ filesData.totalPages }}</span>
    <button (click)="nextPage()" [disabled]="filesData.last" class="btn-page">Next</button>
  </div>
  <div *ngIf="showUploadModal" class="modal-overlay" (click)="closeUploadModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <h2>Upload File</h2>
      <input type="file" (change)="onFileSelected($event)" accept="*/*">
      <div *ngIf="selectedFile" class="selected-file"> Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }}) </div>
      <div class="modal-actions">
        <button (click)="uploadFile()" [disabled]="!selectedFile" class="btn-primary">Upload</button>
        <button (click)="closeUploadModal()" class="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</div>`,
  styles: [`.file-list-container { max-width: 1200px; margin: 0 auto; padding: 2rem; } .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; } h1 { color: #333; font-size: 2rem; } .btn-upload { background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; } .btn-upload:hover { background: #5568d3; } .loading { text-align: center; padding: 2rem; color: #666; } .files-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; } .file-card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s; } .file-card:hover { transform: translateY(-4px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); } .file-icon { font-size: 3rem; text-align: center; margin-bottom: 1rem; } .file-info h3 { margin: 0 0 0.5rem 0; color: #333; font-size: 1.125rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .file-info p { margin: 0.25rem 0; color: #666; } .file-meta { font-size: 0.875rem; color: #999; } .file-actions { display: flex; gap: 0.5rem; margin-top: 1rem; } .btn-action { flex: 1; padding: 0.5rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; } .btn-action:hover { background: #5568d3; } .btn-danger { flex: 1; padding: 0.5rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; } .btn-danger:hover { background: #c82333; } .empty-state { grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: #666; } .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; } .btn-page { padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; } .btn-page:disabled { opacity: 0.5; cursor: not-allowed; } .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; } .modal-content { background: white; padding: 2rem; border-radius: 8px; max-width: 500px; width: 90%; } .modal-content h2 { margin-bottom: 1rem; } .modal-content input[type="file"] { margin: 1rem 0; } .selected-file { margin: 1rem 0; padding: 0.75rem; background: #f8f9fa; border-radius: 4px; } .modal-actions { display: flex; gap: 1rem; margin-top: 1.5rem; } .btn-primary, .btn-secondary { flex: 1; padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; } .btn-primary { background: #667eea; color: white; } .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; } .btn-secondary { background: #6c757d; color: white; }`]
})
export class FileListComponent implements OnInit {
  files$: Observable<PageResponse<FileModel> | null>;
  loading$: Observable<boolean>;
  currentPage = 0;
  pageSize = 10;
  showUploadModal = false;
  selectedFile: File | null = null;
  constructor(
    private store: Store,
    private fileService: FileService
  ) {
    this.files$ = this.store.select(FileSelectors.selectFiles);
    this.loading$ = this.store.select(FileSelectors.selectFilesLoading);
  }
  ngOnInit(): void { this.loadFiles(); }
  loadFiles(): void { this.store.dispatch(FileActions.loadFiles({ page: this.currentPage, size: this.pageSize, sortBy: 'createdAt', sortDir: 'desc' })); }
  openUploadModal(): void { this.showUploadModal = true; }
  closeUploadModal(): void { this.showUploadModal = false; this.selectedFile = null; }
  onFileSelected(event: any): void { this.selectedFile = event.target.files[0]; }
  uploadFile(): void { if (this.selectedFile) { this.store.dispatch(FileActions.uploadFile({ file: this.selectedFile })); this.closeUploadModal(); setTimeout(() => this.loadFiles(), 1000); } }
  downloadFile(file: FileModel): void { this.fileService.downloadFile(file.id, file.originalFileName).subscribe(blob => { const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = file.originalFileName; a.click(); window.URL.revokeObjectURL(url); }); }
  viewFile(file: FileModel): void { this.fileService.downloadFile(file.id, file.originalFileName).subscribe(blob => { const url = window.URL.createObjectURL(blob); window.open(url, '_blank'); }); }
  deleteFile(id: number): void { if (confirm('Are you sure you want to delete this file?')) { this.store.dispatch(FileActions.deleteFile({ id })); } }
  nextPage(): void { this.currentPage++; this.loadFiles(); }
  previousPage(): void { this.currentPage--; this.loadFiles(); }
  formatFileSize(bytes: number): string { return this.fileService.formatFileSize(bytes); }
  formatDate(date: string): string { return new Date(date).toLocaleDateString(); }
  getFileIcon(extension: string): string { const icons: { [key: string]: string } = { pdf: '📄', doc: '📝', docx: '📝', txt: '📃', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', json: '📋', csv: '📊', xlsx: '📊' }; return icons[extension?.toLowerCase()] || '📎'; }
}
