import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseHomePage } from './choose-home.page';

const routes: Routes = [
	{
		path: '',
		component: ChooseHomePage
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ChooseHomePageRoutingModule { }
