import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';

@Component({
	selector: 'app-choose-home',
	templateUrl: './choose-home.page.html',
	styleUrls: ['./choose-home.page.scss'],
})
export class ChooseHomePage implements OnInit {

	profileId: any;

	constructor(public navCtrl: NavController,
		private router: Router,
		public activeRoute: ActivatedRoute,
		public alertCtrl: AlertController) { }

	ngOnInit() {
		console.log('ionViewDidLoad PrivatelabelChooseHomePage');
		this, this.activeRoute.queryParams.subscribe((params) => {
			this.profileId = params['Id'];
		})

	}

	//navigate to PrivatelabelMyOwnLot page
	async gotomyownlot() {
		const alert = await this.alertCtrl.create({
			header: 'Under development...',
			message: 'We are working on it now... stay tuned...',
			buttons: ['Ok']
		});
		await alert.present();
		//this.navCtrl.push(GoShoppingPage, { Id: this.profileId });
	}

	//navigate to PrivatelabelLotsProfile page
	goToDevelopmentsPage() {
		let navExtras: NavigationExtras = {
			queryParams: { Id: this.profileId, Fromarea: false }
		}
		this.router.navigate(['choose-development'], navExtras)
	}

	public close() {
		this.navCtrl.pop();
	}
}
