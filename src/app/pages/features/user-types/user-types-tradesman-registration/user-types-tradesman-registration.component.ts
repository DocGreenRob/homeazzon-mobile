import { Component } from '@angular/core';
import { BasePage } from 'src/app/pages/base/base.page';

@Component({
  selector: 'app-user-types-tradesman-registration',
  templateUrl: './user-types-tradesman-registration.component.html',
  styleUrls: ['./user-types-tradesman-registration.component.scss'],
})
export class UserTypesTradesmanRegistrationComponent extends BasePage {

  goBack() {
		this.navController.back();
	}

}
