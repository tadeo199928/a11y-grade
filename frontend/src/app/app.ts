import { Component } from '@angular/core';
import { UploadComponent } from './components/upload/upload';
import { AnalysisResult } from './services/analyze.service';
import { ResultsComponent } from './components/results/results';
import { NavComponent } from './components/nav/nav';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UploadComponent, ResultsComponent, NavComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  result: AnalysisResult | null = null;
  fileName = '';
  imageDataUrl = '';

  onAnalysisComplete(data: { result: AnalysisResult; fileName: string; imageDataUrl: string }) {
    this.result = data.result;
    this.fileName = data.fileName;
    this.imageDataUrl = data.imageDataUrl;
  }

  goBack() {
    this.result = null;
    this.fileName = '';
    this.imageDataUrl = '';
  }
}
