import { createAction, props } from '@ngrx/store';
import { FileModel, PageResponse } from '../../core/models/file.model';

export const loadFiles = createAction(
  '[File] Load Files',
  props<{ page: number; size: number; sortBy: string; sortDir: string }>()
);

export const loadFilesSuccess = createAction(
  '[File] Load Files Success',
  props<{ files: PageResponse<FileModel> }>()
);

export const loadFilesFailure = createAction(
  '[File] Load Files Failure',
  props<{ error: any }>()
);

export const uploadFile = createAction(
  '[File] Upload File',
  props<{ file: File }>()
);

export const uploadFileSuccess = createAction(
  '[File] Upload File Success',
  props<{ file: FileModel }>()
);

export const uploadFileFailure = createAction(
  '[File] Upload File Failure',
  props<{ error: any }>()
);

export const deleteFile = createAction(
  '[File] Delete File',
  props<{ id: number }>()
);

export const deleteFileSuccess = createAction(
  '[File] Delete File Success',
  props<{ id: number }>()
);

export const deleteFileFailure = createAction(
  '[File] Delete File Failure',
  props<{ error: any }>()
);
