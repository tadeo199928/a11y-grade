import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ResultsComponent } from './results';
import { AnalysisStateService } from '../../services/analysis-state.server.ts';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent, RouterTestingModule],
      providers: [AnalysisStateService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    TestBed.inject(AnalysisStateService).setSnapshot({
      result: {
        score: 88,
        summary: 'Looks good',
        good_areas: ['Contrast'],
        issues: ['Labels'],
      },
      fileName: 'page.png',
      imageDataUrl: 'data:image/png;base64,test',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
