import { Component, OnInit } from '@angular/core';
import { IImageDto } from 'src/app/models/dto/interfaces/IImageDto';
import { ModalController, NavController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services/utlities/utilities.service';
import { PrivateLabelService } from 'src/app/services/private-label/private-label.service';
import { ActivatedRoute } from '@angular/router';
import { PropertyProfileImagesDetailsPage } from '../../property-profile-images-detail/property-profile-images-detail.page';

@Component({
  selector: 'app-property-profile-images',
  templateUrl: './property-profile-images.page.html',
  styleUrls: ['./property-profile-images.page.scss'],
})
export class PropertyProfileImagesPage implements OnInit {

 
	public images: Array<IImageDto>;
	private propertyId: number;
	public propertyName: string;
	spinnerText: string;
	loadingVisible: boolean;

	constructor(public navCtrl: NavController,
    private loading: UtilitiesService,
    private activeRoute: ActivatedRoute,
		private privatelabelService: PrivateLabelService,
		private modalController: ModalController,) {
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
		this.presentSpinner('getting property images...');

		await this.privatelabelService.getPrivateLabelProfileImages(this.propertyId)
			.then(
				(x: any) => {
					if (x) {
						this.images = x.Images;
						this.dismissSpinner();
					}
				},
				(err) => {
					this.dismissSpinner();
				}
			);
	}

	public async openDetailModal(image: any) {
		let searchResultDetailsModal = await this.modalController.create({
			component: PropertyProfileImagesDetailsPage,
			componentProps: { propertyImageDetail: image },
			cssClass: "large-modal image-modal",
		});
		await searchResultDetailsModal.present();
	}

	public close() {
		this.navCtrl.pop();
	}

	async presentSpinner(text: string) {
		this.spinnerText = text;
		this.loadingVisible = true;
	  }
	
	  async dismissSpinner() {
		this.loadingVisible = false;
		this.spinnerText = ''; 
	  }
}
