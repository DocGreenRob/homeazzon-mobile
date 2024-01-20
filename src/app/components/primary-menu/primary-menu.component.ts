import { CommunicatorService } from 'src/app/services/communicator/communicator.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasePage } from 'src/app/pages/base/base.page';
import { NavController, MenuController, Platform } from '@ionic/angular';
import { IPropertyDto } from 'src/app/models/dto/interfaces/IPropertyDto';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router } from '@angular/router';


@Component({
	selector: 'primary-menu',
	templateUrl: './primary-menu.component.html',
	styleUrls: ['./primary-menu.component.scss'],
})
export class PrimaryMenuComponent extends BasePage {
	@Input() set userData(value) {
		if (!value?.UserName.includes(this.userName)) {
			this.User = value;
			this.getUsername();
		}
	}

	@Input() type: string;
	@Input() propertyName: string;
	@Input() title: string;
	@Input() iconUrl: string;
	@Input() subTitle: string;
	@Input() isViewLoaded: boolean;
	@Output() _openMenuClickHandler: any = new EventEmitter();

	public userName: string = '';
	constructor(public override navController: NavController,
		public override menuController: MenuController,
		public override communicator: CommunicatorService,
		public override platform: Platform,
		public override storageService: LocalStorageService,
		public override router: Router,) {
		super(
			null,
			null,
			null,
			null,
			null,
			router,
			null,
			null,
			null,
			null,
			storageService
		);
	}

	close() {
		this.navController.pop();
	}

	override openMenu() {
		this._openMenuClickHandler.emit(true)
	}

	openMainMenu() {
		this.menuController.enable(true, 'mainMenu');
		this.menuController.open('mainMenu');
	}

	override ngOnInit() {
		console.log(this.type);

		this.communicator.getSelectedProperty().subscribe((property: IPropertyDto) => {
			this.propertyName = property.Name;
		});

		this.getUsername();
	}

	getUsername() {
		if (this.User) {
			let idx: number = this.User.UserName.indexOf('@');
			this.userName = this.User.UserName.substr(0, idx);
		}
	}

	override get usersPlatform() {
		let platform = "android"
		if (this.platform.is('ios')) {
			platform = 'ios'
		}
		return platform;
	}
}
