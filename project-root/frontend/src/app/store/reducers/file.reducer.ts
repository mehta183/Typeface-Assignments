import { createReducer, on } from '@ngrx/store';
import { FileModel, PageResponse } from '../../core/models/file.model';
import * as FileActions from '../actions/file.actions';

export interface FileState {
  files: PageResponse<FileModel> | null;
  loading: boolean;
  error: any;
}

export const initialState: FileState = {
  files: null,
  loading: false,
  error: null
};

export const fileReducer = createReducer(
  initialState,
  on(FileActions.loadFiles, state => ({ ...state, loading: true, error: null })),
  on(FileActions.loadFilesSuccess, (state, { files }) => ({ ...state, files, loading: false })),
  on(FileActions.loadFilesFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(FileActions.uploadFile, state => ({ ...state, loading: true })),
  on(FileActions.uploadFileSuccess, state => ({ ...state, loading: false })),
  on(FileActions.uploadFileFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(FileActions.deleteFile, state => ({ ...state, loading: true })),
  on(FileActions.deleteFileSuccess, (state, { id }) => ({ ...state, files: state.files ? { ...state.files, content: state.files.content.filter(f => f.id !== id) } : null, loading: false })),
  on(FileActions.deleteFileFailure, (state, { error }) => ({ ...state, error, loading: false }))
);
