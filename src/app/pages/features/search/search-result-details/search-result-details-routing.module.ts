import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchResultDetailsPage } from './search-result-details.page';

const routes: Routes = [
  {
    path: '',
    component: SearchResultDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchResultDetailsPageRoutingModule {}
