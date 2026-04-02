import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UploadComponent } from './upload';
import { AnalyzeService } from '../../services/analyze.service';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadComponent, RouterTestingModule],
      providers: [
        {
          provide: AnalyzeService,
          useValue: {
            analyze: () => of({ choices: [{ message: { content: '{"score":100,"summary":"ok","good_areas":[],"issues":[]}' } }] }),
            parseResult: () => ({ score: 100, summary: 'ok', good_areas: [], issues: [] }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
