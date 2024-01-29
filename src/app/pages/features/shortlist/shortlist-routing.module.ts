import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortlistsPage } from './shortlist.component';


const routes: Routes = [
  {
    path: '',
    component: ShortlistsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShortlistsRoutingModule {}
