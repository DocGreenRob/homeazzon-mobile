import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterBedroomCategoryComponent } from './master-bedroom-category.component';


const routes: Routes = [
  {
    path: '',
    component: MasterBedroomCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterBedroomCategoryPageRoutingModule {}
