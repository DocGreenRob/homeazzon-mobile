import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, LoadingController, NavController } from '@ionic/angular';
import { PrivateLabelService } from 'src/app/services/private-label/private-label.service';
import { Storage } from '@ionic/storage';
import { IDeterminePathDto } from 'src/app/models/dto/interfaces/IDeterminePathDto';
import { Router } from '@angular/router';

@Component({
	selector: 'app-share-mail-partner',
	templateUrl: './share-mail-partner.page.html',
	styleUrls: ['./share-mail-partner.page.scss'],
})
export class ShareMailPartnerPage implements OnInit {
	user: any = {};
	user1: any = {};
	userName: any;
	loading: any;
	userId: any;

	constructor(
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public loadingCtrl: LoadingController,
		private navController: NavController,
		private privateLabelService: PrivateLabelService,
		private router: Router,
		private storage: Storage) {
	}

	ngOnInit() {

		console.log('ionViewDidLoad ShareMailPartnerPage');

		// get the userId from the local-storage 
		this.storage.get('userId').then((data) => {
			this.user.UserId = data;
		});

		// get the userName from the local-storage
		this.storage.get("userName").then(value => {
			this.user.CurrentUser = value;
		});

	}

	// set validation for email, fullname and confirmmail 
	async checkValidation() {
		if (this.user.Email == undefined || this.user.FullName == undefined || this.user1.confirmemail == undefined) {
			const alert = await this.alertCtrl.create({
				header: 'Error!',
				message: 'Invalid Credential',
				cssClass: 'alertDanger',
				buttons: ['Ok']
			})
			await alert.present();
		} else {
			if (this.user.Email !== this.user1.confirmemail) {
				this.displayToast("Please check your email,Emails must match");
			} else {
				this.shareWithPartner();
			}
		}
	}

	// show the for validation 
	async	displayToast(message) {
		const toast = await this.toastCtrl.create({ message: message, duration: 3000, position: 'top' })
		await toast.present();
	}

	// get share the link with partner and navigate the private label profile page 
	async shareWithPartner() {
		this.loading = this.loadingCtrl.create({
			message: 'Creating Account',
			cssClass: 'my-loading-class'
		});
		this.loading.present();
		try {
			this.privateLabelService.shareWithPartner(this.user)
				.then(
					(response: any) => {
						this.storage.get('determinePathObj')
							.then(
								(x: IDeterminePathDto) => {
									this.loading.dismiss();
									if (x.IsPrivateLabelUserDownload === true) {
										this.router.navigate(['private-label-profile'])

									} else {
										this.router.navigate(['dashboard']);
									}
								},
								(err) => { }
							);
					},
					(err) => {
						this.router.navigate(['private-label-profile'])
					}
				);
		} catch (error) {
			this.router.navigate(['private-label-profile'])
		}
		if (this.loading !== null) {
			this.loading.dismiss();
		}

	}

	close() {
		this.navController.back();
	}

}
