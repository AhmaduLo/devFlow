import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GuideViewerComponent } from './components/guide-viewer/guide-viewer.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'guide/:id',
    component: GuideViewerComponent
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
