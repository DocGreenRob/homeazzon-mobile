import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utlities/utilities.service';
import { PrivateLabelService } from 'src/app/services/private-label/private-label.service';
import { MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
	selector: 'app-congratulations',
	templateUrl: './congratulations.page.html',
	styleUrls: ['./congratulations.page.scss'],
})
export class CongratulationsPage implements OnInit {
	getPrivateLabelProfilegreenlist: any;
	profileId: any;
	userId: any;
	userName: any;

	constructor(
		private loading: UtilitiesService,
		private privatelabelService: PrivateLabelService,
		private menuController: MenuController,
		private router: Router,
		public storage: Storage) {
		//get userId form local-storage
		this.storage.get('userId').then((userId) => {
			this.userId = userId;
		})

		//get userId form displayName
		this.storage.get('displayName').then((userName) => {
			this.userName = userName;
		})
	}

	ngOnInit() {
		console.log('ionViewDidLoad PrivatelabelMyOwnLotPage');
	}

	//navigate to Main page with userId and userName
	gotoMainPage() {
		this.menuController.enable(true, 'regularMenu');
		this.menuController.enable(true, 'propertyMenu');
		localStorage.setItem("refreshProperties", "true");
		this.router.navigate(['dashboard'])

	}

	//get label PrivateLabelProfilegreen  by profileId
	async getPrivateLabelProfilegreen() {
		let loader = await this.loading.getLoader('getting label profilegreen...');
		await loader.present();

		await this.privatelabelService.getPrivateLabelProfile(this.profileId).subscribe(
			(response: any) => {
				if (response) {
					console.log('getPrivateLabelProfilegreenlist', response);
					this.getPrivateLabelProfilegreenlist = response;
					loader.dismiss();
				}
			},
			(error) => {
				loader.dismiss();
				console.log(error);
			}
		);
	}


}
