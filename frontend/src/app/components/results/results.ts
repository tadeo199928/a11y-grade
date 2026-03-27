import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnalysisResult } from '../../services/analyze.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class ResultsComponent {
  @Input() result!: AnalysisResult;
  @Input() fileName = '';
  @Input() imageDataUrl = '';
  @Output() back = new EventEmitter<void>();

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

  goBack() {
    this.back.emit();
  }
}