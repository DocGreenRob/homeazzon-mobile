import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/pages/base/base.page';

@Component({
  selector: 'app-user-types-vendor-registration',
  templateUrl: './user-types-vendor-registration.component.html',
  styleUrls: ['./user-types-vendor-registration.component.scss'],
})
export class UserTypesVendorRegistrationComponent  extends BasePage {

  goBack() {
		this.navController.back();
	}
  
}
