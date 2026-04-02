import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnalysisStateService } from '../../services/analysis-state.server.ts.js';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class ResultsComponent {
  private readonly router = inject(Router);
  private readonly analysisState = inject(AnalysisStateService);

  protected readonly snapshot = computed(() => this.analysisState.snapshot());

  constructor() {
    effect(() => {
      if (!this.snapshot()) {
        void this.router.navigate(['/']);
      }
    });
  }

  get grade(): string {
    const s = this.result.score;
    if (s >= 91) return 'A+ (EXCELLENT)';
    if (s >= 81) return 'B+ (GOOD)';
    if (s >= 71) return 'B (GOOD)';
    if (s >= 61) return 'C+ (FAIR)';
    if (s >= 41) return 'C (NEEDS WORK)';
    return 'F (CRITICAL)';
  }

  get gradeClass(): string {
    const s = this.result.score;
    if (s >= 71) return 'good';
    if (s >= 41) return 'fair';
    return 'bad';
  }

  get goodAreasCount(): string {
    return this.result.good_areas.length.toString().padStart(2, '0');
  }

  get issuesCount(): string {
    return this.result.issues.length.toString().padStart(2, '0');
  }

  get result() {
    return this.snapshot()?.result ?? {
      score: 0,
      summary: '',
      good_areas: [],
      issues: [],
    };
  }

  goBack() {
    this.analysisState.clearSnapshot();
    void this.router.navigate(['/']);
  }
}