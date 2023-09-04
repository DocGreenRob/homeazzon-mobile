import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController, Platform } from '@ionic/angular';
import { UxNotifierService } from 'src/app/services/uxNotifier/ux-notifier.service';
import { Constants } from 'src/app/common/Constants';

@Component({
	selector: 'app-add-room-modal',
	templateUrl: './add-room-modal.page.html',
	styleUrls: ['./add-room-modal.page.scss'],
})
export class AddRoomModalPage implements OnInit {

	areas: any;
	areaId: number;
	roomName: string;
	sqFt: number;
	constants: Constants = new Constants();
	areaType: string;
	uiType: string;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private alertService: UxNotifierService,
		public platform: Platform,
		private modalController: ModalController) {
	}

	ngOnInit() {
		console.log(this.navParams.data);
		this.areas = this.navParams.get("areas");
		this.areaType = this.navParams.get("areaTypeName");

		if (this.navParams.get("UiType")) {
			this.uiType = this.navParams.get("UiType");
		}
	}

	saveRoom() {
		if (this.uiType == 'customHouse') {
			this.modalController.dismiss({ Id: 0, Name: this.roomName, sqFt: this.sqFt });
		} else {
			if (this.areaId && this.roomName && this.sqFt) {
				this.modalController.dismiss({ Id: 0, name: this.roomName, sqFt: this.sqFt, areaType: this.areaType, Area: { Id: this.areaId } });
			} else {
				this.alertService.showToast("Please fill all the fields to continue", this.constants.ToastColorBad)
			}
		}

	}

	cancel() {
		this.modalController.dismiss();
	}

	areaSelectionChanged() {
		for (let area of this.areas) {
			if (area.Id == this.areaId) {
				this.roomName = area.Name;
			}
		}
	}

}
