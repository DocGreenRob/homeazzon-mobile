import { Component, OnInit, Input } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
	selector: 'navigation-sub-menu',
	templateUrl: './navigation-sub-menu.component.html',
	styleUrls: ['./navigation-sub-menu.component.scss'],
})
export class NavigationSubMenuComponent implements OnInit {
	@Input() showBackButton: boolean;
	@Input() type: string;
	@Input() types: Array<string> = ['logoMenu', 'titleMenu'];
	@Input() title: string;

	constructor(private navController: NavController, public platform: Platform) { }

	ngOnInit() { this.platform.is }

	goBack() {
		this.navController.back();
	}

	get usersPlatform(): string {
		if (this.platform.is('ios')
			|| this.platform.is('iphone')
			|| this.platform.is('ipad')) {
			return 'ios';
		} else {
			return 'android';
		}
	}
}
