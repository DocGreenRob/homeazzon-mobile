import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UtilitiesService } from 'src/app/services/utlities/utilities.service';
import { PrivateLabelService } from 'src/app/services/private-label/private-label.service';

@Component({
  selector: 'app-property-profile-details',
  templateUrl: './property-profile-details.page.html',
  styleUrls: ['./property-profile-details.page.scss'],
})
export class PropertyProfileDetailsPage implements OnInit {

  labelprofilelist: any;
	propertyId: number;
	privatelabelprofileset: any = [];
	keys: any;
	showLevel1 = null;
	showLevel2 = null;
	bedroomToggle: boolean = false;
	bathroomToggle: boolean = false;
	commonAreaToggle: boolean = false;
	exteriorAreaToogle: boolean = false;
	totalSqlFeet: any = 0;
	propertyName: string;
	constructor(public navCtrl: NavController,
		public activeRoute: ActivatedRoute,
		private loading: UtilitiesService,
		private privatelabelService: PrivateLabelService) { }

	async ngOnInit() {
    console.log('ionViewDidLoad PrivatelabeprofilelistPage (PrivatelabelExpandablelistPage)');
    this.activeRoute.queryParams.subscribe((params)=>{
      this.propertyId = params['Id'] as number;
		this.propertyName = params["Name"];

		this.getPrivateLabelProfilelist();
    })
		
	}



	toogleViews(type) {
		if (type == "bedroom") {
			this.bedroomToggle = !this.bedroomToggle;
			this.bathroomToggle = false;
			this.commonAreaToggle = false;
			this.exteriorAreaToogle = false;
		} else if (type == "bathroom") {
			this.bathroomToggle = !this.bathroomToggle;
			this.bedroomToggle = false;
			this.commonAreaToggle = false;
			this.exteriorAreaToogle = false;
		} else if (type == "commonArea") {
			this.commonAreaToggle = !this.commonAreaToggle;
			this.bathroomToggle = false;
			this.bedroomToggle = false;
			this.exteriorAreaToogle = false;
		} else if (type == "exterior") {
			this.exteriorAreaToogle = !this.exteriorAreaToogle;
			this.commonAreaToggle = false;
			this.bathroomToggle = false;
			this.bedroomToggle = false;

		}
	}

	// get navigate the privatelabel choose home  
	gotochoosehome() {
		//this.navCtrl.push(PrivatelabelChooseHomePage);
	}

	// get  the privatelabel profile list 
	async getPrivateLabelProfilelist() {
		let loader = await this.loading.getLoader('getting label profile list...');
		await loader.present();
	

		await this.privatelabelService.getPropertyOverview(this.propertyId)
			.then(
				(x: any) => {
					console.log('labelprofilelist', x);
					this.privatelabelprofileset = x.Data;
					this.getTotalSqFt();
					loader.dismiss();
				},
				(error) => {
					loader.dismiss();
					console.log(error);
				}
			);
	}

	public getKeys(data) {
		this.keys = Object.keys(data);
		return true;
	}

	public getTotalSqFt() {
		this.privatelabelprofileset.map(x => {
			if (x.Bedrooms) {
				this.totalSqlFeet = this.totalSqlFeet + x.SqFeet;
			}
			if (x.Bathrooms) {
				this.totalSqlFeet = this.totalSqlFeet + x.SqFeet;
			}
			if (x.InteriorAreas) {
				this.totalSqlFeet = this.totalSqlFeet + x.SqFeet;
			}
			if (x.ExteriorAreas) {
				this.totalSqlFeet = this.totalSqlFeet + x.SqFeet;
			}
		})
	}

	public close() {
		this.navCtrl.pop();
	}

}
