import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicatorService } from '@app/services/communicator/communicator.service';
import { FeaturesService } from '@app/services/features/features.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { UserTypesService } from '@app/services/user-types/user-types.service';
import { UxNotifierService } from '@app/services/uxNotifier/ux-notifier.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController, AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.page.html',
  styleUrls: ['./marketplace.page.scss'],
})
export class MarketplacePage extends BasePage {
  constructor( 
    public override navController: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override router: Router,
    public override userTypesService: UserTypesService,
    public featureService: FeaturesService,
    public override uxNotifierService: UxNotifierService,
    public override platform: Platform,
    public override inAppBrowser: InAppBrowser,
    public override storageService: LocalStorageService
    ) {
      super(
      navController,
      null,
      communicator,
      menuController,
      platform,
      router,
      uxNotifierService,
      userTypesService,
      featureService,
      inAppBrowser,
      storageService
    );
   }

   override async ngOnInit() {
    console.log('ngOnInit marketplace');
    console.log("this.user:", this.User)
  }

  navigate(){
    this.router.navigate(['vendor-marketplace']);
  }

}