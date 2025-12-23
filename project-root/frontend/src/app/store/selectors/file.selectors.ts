import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FileState } from '../reducers/file.reducer';

export const selectFileState = createFeatureSelector<FileState>('files');

export const selectFiles = createSelector(
  selectFileState,
  (state: FileState) => state.files
);

export const selectFilesLoading = createSelector(
  selectFileState,
  (state: FileState) => state.loading
);

export const selectFilesError = createSelector(
  selectFileState,
  (state: FileState) => state.error
);
