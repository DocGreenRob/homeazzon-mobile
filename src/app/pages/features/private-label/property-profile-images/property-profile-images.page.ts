import { Component, OnInit } from '@angular/core';
import { IImageDto } from 'src/app/models/dto/interfaces/IImageDto';
import { NavController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utlities/utilities.service';
import { PrivateLabelService } from 'src/app/services/private-label/private-label.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-profile-images',
  templateUrl: './property-profile-images.page.html',
  styleUrls: ['./property-profile-images.page.scss'],
})
export class PropertyProfileImagesPage implements OnInit {

 
	public images: Array<IImageDto>;
	private propertyId: number;
	public propertyName: string;

	constructor(public navCtrl: NavController,
    private loading: UtilitiesService,
    private activeRoute: ActivatedRoute,
		private privatelabelService: PrivateLabelService) {
	}

	async ngOnInit() {
  this.activeRoute.queryParams.subscribe((params)=>{
    console.log('ionViewDidLoad PrivatelabelProfileImagesPage');
		this.propertyId = params['Id'];
		this.propertyName = params['Name'];
		this.getPrivateLabelProfileImages();
  })
	
	}

	// set The property for ngx-gallery for sliding the image and thumbnail image 


	// get the PrivateLabel profile images with profileId
	async getPrivateLabelProfileImages() {
		let loader = await this.loading.getLoader('getting property images...');
		await loader.present();
	

		await this.privatelabelService.getPrivateLabelProfileImages(this.propertyId)
			.then(
				(x: any) => {
					if (x) {
						this.images = x.Images;
						loader.dismiss();
					}
				},
				(err) => {
					loader.dismiss();
				}
			);
	}

	public close() {
		this.navCtrl.pop();
	}
}
