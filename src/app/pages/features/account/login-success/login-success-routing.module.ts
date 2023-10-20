import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSuccessComponent } from './login-success.component';


const routes: Routes = [
	{
		path: '',
		component: LoginSuccessComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LoginSuccessPageRoutingModule { }
