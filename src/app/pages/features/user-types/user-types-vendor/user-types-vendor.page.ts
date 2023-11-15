import { Component } from '@angular/core';
import { BasePage } from 'src/app/pages/base/base.page';

@Component({
  selector: 'app-user-types-vendor',
  templateUrl: './user-types-vendor.page.html',
  styleUrls: ['./user-types-vendor.page.scss'],
})
export class UserTypesVendorPage extends BasePage {

  clickEvent(){
    this.router.navigate(["user-types-vendor-registration"]);
  }

  goBack() {
		this.navController.back();
	}

}
