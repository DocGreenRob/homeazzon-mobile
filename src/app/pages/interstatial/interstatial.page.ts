import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BasePage } from '../base/base.page';
import { CommunicatorService } from '@app/services/communicator/communicator.service';
import { FeaturesService } from '@app/services/features/features.service';
import { LocalStorageService } from '@app/services/local-storage.service';
import { UserTypesService } from '@app/services/user-types/user-types.service';
import { UxNotifierService } from '@app/services/uxNotifier/ux-notifier.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController, AlertController, LoadingController, MenuController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-interstatial',
  templateUrl: './interstatial.page.html',
  styleUrls: ['./interstatial.page.scss'],
})
export class InterstatialPage extends BasePage {
  menus : any[] = [
    {
      title: "Home Management",
      browse:"Browse Items",
      image: 'assets/imgs/house.png',
      route: 'dashboard'
    },
    {
      title: "Marketplace & Service",
      browse:"Items and Services ",
      image: 'assets/imgs/Sofa.png',
      route: ''
    },
    {
      title: "Finance Management",
      browse:"Analyze and manage",
      image: 'assets/imgs/bill.png',
      route: ''
    },
    {
      title: "Community & Education",
      browse:"Learn and  Share",
      image: 'assets/imgs/community.png',
      route: ''
    }
  ]

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
    console.log('ngOnInit InterstatialPage');
    console.log("this.user:", this.User)
  }

  navigate(menu) {
    if(menu.route.length){
      this.router.navigate([menu.route]);
    }
  }
}