import { Component, NgZone } from '@angular/core';
import {
  Platform,
  AlertController,
  LoadingController,
  MenuController,
  NavController,
} from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { HttpClient } from '@angular/common/http';
// import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { IDeterminePathDto } from './models/dto/interfaces/IDeterminePathDto';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { BasePage } from './pages/base/base.page';
import { CommunicatorService } from './services/communicator/communicator.service';
import { IUserDto } from './models/dto/interfaces/IUserDto';
import { AppStorageService } from './services/app-storage/app-storage.service';
import { IPropertyDto } from './models/dto/interfaces/IPropertyDto';
// import { ThemeableBrowserinAppBrowserOptionsinAppBrowserObject } from '@ionic-native/themeable-browser';
// Import Auth0Cordova
//var Auth0Cordova = require("@auth0/cordova");
import { IAuthTokenDto } from './models/dto/interfaces/IAuthTokenDto';
//import { JwtHelperService } from "@auth0/angular-jwt";
import { Constants } from 'src/app/common/Constants';
import Axios from 'axios';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { IdTokenDto } from './models/dto/interfaces/IdTokenDto';
import { ICompanyTypeDto } from './models/dto/interfaces/ICompanyTypeDto';
import { CompanyTypesService } from './services/company-types/company-types.service';
import { IUserTypeDto } from './models/dto/interfaces/IUserTypeDto';
import * as qs from 'querystring';
import { AccountService } from './services/account/account.service';
import { filter, Subject, takeUntil } from 'rxjs';
import { FirebaseAuthService } from './services/FirebaseAuth/firebase-auth.service';
//import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
//import { NavigationAuthenticationClient } from './services/navigationAuthenticationClient';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LocalStorageService } from './services/local-storage.service';
//import { EventMessage, EventType } from '@azure/msal-browser';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends BasePage {
  private readonly _destroying$ = new Subject<void>();
  private _loading: any;

  // rootPage:any = SigninPage;
  public rootPage: any;

  //new
  pages!: Array<{ image: string; title: string; url: any }>;
  photoUrl: any =
    'https://firebasestorage.googleapis.com/v0/b/itt-content.appspot.com/o/Common%2Fassets%2Fimgs%2Flogo.png?alt=media&token=ca3a844b-8e53-489f-8530-7342edeb98b3';
  userName: any;
  displayName: any;
  userTypes: any;
  userId: any;
  UserUserTypes: any = [];
  isOwner: boolean = false;
  isPrivateLabeler: boolean = false;
  isPrivateLabelUser: boolean = false;
  userProperties: any = [];
  getPropertiesSubsription: any;
  constants = new Constants();

  //new
  constructor(
    public override platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: Storage,
    private alertCtrl: AlertController,
    public http: HttpClient,
    public override communicator: CommunicatorService,
    public menu: MenuController,
    private storageCtrl: AppStorageService,
    public loadingCtrl: LoadingController,
    public override router: Router,
    private ngzone: NgZone,
    private firebaseService: FirebaseAuthService,
    private iab: InAppBrowser,
    public override storageService: LocalStorageService
    ) {
    super(null, null, communicator, menu, platform, router, null, null, null, null, storageService);

    platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Redirect back to app after authenticating
      (window as any).handleOpenURL = (url: string) => {
        // TODO: is this needed?
      };
    });
  }

  override async ngOnInit() {
    console.log('ngOnInit AppComponent');
    await this.storage.create();

    this.listenPropertiesLoadedEvent();
    this.listenLoginEvent();
    this.listenLogOutEvent();

    this.pages = [
      {
        image:
          '../assets/icon/User.svg',
        title: 'User Types',
        url: 'user-types-manager',
      },
      {
        image:
          '../assets/icon/Notification.svg',
        title: 'Notifications',
        url: 'notifications',
      },
      {
        image:
          '../assets/icon/question.svg',
        title: 'Help',
        url: 'help',
      },
      {
        image:
          '../assets/icon/Setting.svg',
        title: 'Settings',
        url: 'settings',
      },
    ];
  }

  // TODO: Remove
  async listenLoginEvent(): Promise<void> {
    window.addEventListener('user:loggedIn', (x: any) => {

      if (this.User !== undefined && this.User !== null && this.User.UserName !== undefined && this.User.UserName !== null && this.User.UserName !== '') {
        this.displayName = this.User.UserName;
      } else {
        this.displayName = '';
      }

      this.router.navigate(['login-success']);

      // TODO: Put in login-success; don't route from here
      setTimeout(() => {
        this.router.navigate(['dashboard']);
      }, 3000)
    });
  }

  async listenLogOutEvent() {
    window.addEventListener('user:loggedOut', (x) => {
      this.displayName = null;
      this.menuController.close();
    });
  }

  async listenPropertiesLoadedEvent(): Promise<void> {
    window.addEventListener('properties:loaded', (x: any) => {
      this.ngzone.run(() => {
        this.userProperties = x.detail;
        this.displayName = this.User.UserName;
      });
    });
  }

  async showAlertToUserAfterUpdate(title, message) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          },
        },
      ],
    });
    await alert.present();
  }

  async openPage(page) {
    if (page.url === 'logout') {
      const alert = await this.alertCtrl.create({
        header: 'Confirm',
        message: 'Are you sure want to Logout?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              return;
            },
          },
          {
            text: 'Ok',
            cssClass: 'signout',
            handler: () => {
              this.firebaseService.logOut();
            },
          },
        ],
      });

      await alert.present();

      return;
    } else {
      this.router.navigate([page.url]);
      this.menuController.close();
    }
  }

  public designHome() {
    let navExtras: NavigationExtras = {
      queryParams: {
        showBackButton: true,
      },
    };

    this.menuController.close();
    this.router.navigate(['property-profiles'], navExtras);
  }

  async viewProperty(p: IPropertyDto) {
    await this.communicator.sendSelectedProperty(p);
    this.storageService.delete('Lineitems');
    this.menu.close('propertyMenu');
  }
}
