import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav';
import { FooterComponent } from './components/footer/footer';
import { AnalysisStateService } from './services/analysis-state.server.ts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly analysisState = inject(AnalysisStateService);

  goHome() {
    this.analysisState.clearSnapshot();
    void this.router.navigate(['/']);
  }
}
