import { CommunicatorService } from 'src/app/services/communicator/communicator.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePage } from 'src/app/pages/base/base.page';
import { NavController, MenuController, Platform } from '@ionic/angular';
import { IPropertyDto } from 'src/app/models/dto/interfaces/IPropertyDto';


@Component({
	selector: 'primary-menu',
	templateUrl: './primary-menu.component.html',
	styleUrls: ['./primary-menu.component.scss'],
})
export class PrimaryMenuComponent {
	@Input() type: string;
	@Input() propertyName: string;
	@Input() title: string;
	@Input() iconUrl: string;
	@Input() subTitle: string;
	@Input() isViewLoaded: boolean;
	@Output() _openMenuClickHandler: any = new EventEmitter();

	constructor(private navController: NavController,
		private menuController: MenuController,
		private communicator: CommunicatorService, private platform: Platform) {

	}
	close() {
		this.navController.pop();
	}
	openMenu() {
		this._openMenuClickHandler.emit(true)
	}

	openMainMenu() {
		this.menuController.enable(true, 'mainMenu');
		this.menuController.open('mainMenu');
	}

	ngOnInit() {
		console.log(this.type);
		console.log(this.title);
		this.communicator.getSelectedProperty().subscribe((property: IPropertyDto) => {
			this.propertyName = property.Name;
		})
	}

	get usersPlatform() {
		let platform = "android"
		if (this.platform.is('ios')) {
			platform = 'ios'
		}
		return platform;
	}


}
