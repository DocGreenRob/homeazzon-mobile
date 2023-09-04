import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
	selector: 'save-sub-menu',
	templateUrl: './save-sub-menu.component.html',
	styleUrls: ['./save-sub-menu.component.scss'],
})
export class SaveSubMenuComponent implements OnInit {
	@Input() title: string;
	@Input() isShowSave: boolean;
	@Output() _saveClickEventHandler: any = new EventEmitter();
	constructor(private navController: NavController, private platform: Platform) { }

	ngOnInit() { }

	save() {

		this._saveClickEventHandler.emit(true);
	}

	close() {
		this.navController.pop();
	}

	get usersPlatform() {
		let platform = "android"
		if (this.platform.is('ios')) {
			platform = 'ios'
		}
		return platform;
	}


}
