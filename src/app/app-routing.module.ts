import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'index',
    loadChildren: () => import('./pages/features/app-start/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/features/account/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/features/account/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/features/app-start/intro/intro.module').then( m => m.IntroPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
