import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utlities/utilities.service';
import { PrivateLabelService } from 'src/app/services/private-label/private-label.service';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { LocalStorageService } from '@app/services/local-storage.service';

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
  spinnerText: string;
  loadingVisible: boolean;
  public isIos: boolean = false;

  constructor(
    private loading: UtilitiesService,
    private privatelabelService: PrivateLabelService,
    private menuController: MenuController,
    private router: Router,
    public storage: Storage,
    private storageService: LocalStorageService,
    public platform: Platform) {
    this.isIos = this.platform.is('ios');
    //get userId form local-storage
    this.storage.get('userId').then((userId) => {
      this.userId = userId;
    });

    //get userId form displayName
    this.storage.get('displayName').then((userName) => {
      this.userName = userName;
    });
  }

  ngOnInit() {
    console.log('ionViewDidLoad PrivatelabelMyOwnLotPage');
  }

  //navigate to Main page with userId and userName
  gotoMainPage() {
    this.menuController.enable(true, 'regularMenu');
    this.menuController.enable(true, 'propertyMenu');
    this.storageService.set("refreshProperties", "true");
    this.router.navigate(['dashboard'])

  }

  //get label PrivateLabelProfilegreen  by profileId
  async getPrivateLabelProfilegreen() {
    this.presentSpinner('getting label profilegreen...');

    await this.privatelabelService.getPrivateLabelProfile(this.profileId).subscribe(
      (response: any) => {
        if (response) {
          console.log('getPrivateLabelProfilegreenlist', response);
          this.getPrivateLabelProfilegreenlist = response;
          this.dismissSpinner();
        }
      },
      (error) => {
        this.dismissSpinner();
        console.log(error);
      }
    );
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
