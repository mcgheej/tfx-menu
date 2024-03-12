import { BehaviorSubject } from 'rxjs';

export let fileOpen = false;
const fileOpenSubject$ = new BehaviorSubject<boolean>(fileOpen);
export const fileOpen$ = fileOpenSubject$.asObservable();

export function updateFileOpen(newValue: boolean) {
  if (newValue !== fileOpen) {
    fileOpen = newValue;
    fileOpenSubject$.next(fileOpen);
  }
}

export let autoSave = false;
const autoSaveSubject$ = new BehaviorSubject<boolean>(autoSave);
export const autoSave$ = autoSaveSubject$.asObservable();

export function toggleAutoSave() {
  autoSave = !autoSave;
  autoSaveSubject$.next(autoSave);
}
