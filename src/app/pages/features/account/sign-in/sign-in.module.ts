import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignInPageRoutingModule } from './sign-in-routing.module';

import { SignInPage } from './sign-in.page';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		SignInPageRoutingModule,
	],
	declarations: [SignInPage],
	providers: [SafariViewController]
})
export class SignInPageModule { }
