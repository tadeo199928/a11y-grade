import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/upload/upload').then((m) => m.UploadComponent),
  },
  {
    path: 'results',
    loadComponent: () => import('./components/results/results').then((m) => m.ResultsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
