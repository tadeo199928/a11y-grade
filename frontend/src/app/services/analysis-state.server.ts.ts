import { Injectable, signal } from '@angular/core';
import { AnalysisResult } from './analyze.service';

export interface AnalysisSnapshot {
  result: AnalysisResult;
  fileName: string;
  imageDataUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class AnalysisStateService {
  private readonly snapshotState = signal<AnalysisSnapshot | null>(null);

  readonly snapshot = this.snapshotState.asReadonly();

  setSnapshot(snapshot: AnalysisSnapshot) {
    this.snapshotState.set(snapshot);
  }

  clearSnapshot() {
    this.snapshotState.set(null);
  }
}
