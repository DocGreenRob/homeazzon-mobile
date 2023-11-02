import { Component } from '@angular/core';
import { BasePage } from 'src/app/pages/base/base.page';

@Component({
  selector: 'app-user-types-tradesman',
  templateUrl: './user-types-tradesman.page.html',
  styleUrls: ['./user-types-tradesman.page.scss'],
})
export class UserTypesTradesmanPage extends BasePage {

  clickEvent(){
    this.router.navigate(["user-types-tradesman-registration"]);
  }

  goBack() {
		this.navController.back();
	}

}
