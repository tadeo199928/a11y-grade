import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyzeService } from '../../services/analyze.service';
import { AnalysisStateService } from '../../services/analysis-state.server.ts';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class UploadComponent {
  private readonly analyzeService = inject(AnalyzeService);
  private readonly analysisState = inject(AnalysisStateService);
  private readonly router = inject(Router);

  isLoading = false;
  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && this.isValidImage(file)) {
      this.processFile(file);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  private isValidImage(file: File): boolean {
    return file.type === 'image/png' || file.type === 'image/jpeg';
  }

  private processFile(file: File) {
    this.isLoading = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];

      this.analyzeService.analyze(base64).subscribe({
        next: (response) => {
          const result = this.analyzeService.parseResult(response);
          this.isLoading = false;
          this.analysisState.setSnapshot({
            result,
            fileName: file.name,
            imageDataUrl: dataUrl,
          });
          void this.router.navigate(['/results']);
        },
        error: () => {
          this.isLoading = false;
        }
      });
    };
  }
}