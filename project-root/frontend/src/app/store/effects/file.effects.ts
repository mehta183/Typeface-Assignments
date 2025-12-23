import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { FileService } from '../../core/services/file.service';
import * as FileActions from '../actions/file.actions';

@Injectable()
export class FileEffects {
  loadFiles$ = createEffect(() => this.actions$.pipe(
    ofType(FileActions.loadFiles),
    switchMap(({ page, size, sortBy, sortDir }) => this.fileService.getFiles(page, size, sortBy, sortDir).pipe(
      map(response => FileActions.loadFilesSuccess({ files: response.data })),
      catchError(error => of(FileActions.loadFilesFailure({ error })))
    ))
  ));

  uploadFile$ = createEffect(() => this.actions$.pipe(
    ofType(FileActions.uploadFile),
    switchMap(({ file }) => this.fileService.uploadFile(file).pipe(
      map(response => FileActions.uploadFileSuccess({ file: response.data })),
      catchError(error => of(FileActions.uploadFileFailure({ error })))
    ))
  ));

  deleteFile$ = createEffect(() => this.actions$.pipe(
    ofType(FileActions.deleteFile),
    switchMap(({ id }) => this.fileService.deleteFile(id).pipe(
      map(() => FileActions.deleteFileSuccess({ id })),
      catchError(error => of(FileActions.deleteFileFailure({ error })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private fileService: FileService
  ) {}
}
