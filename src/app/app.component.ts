import { Component, NgZone } from '@angular/core';
import {
  Platform,
  AlertController,
  LoadingController,
  MenuController,
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
// import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { NavigationAuthenticationClient } from './services/navigationAuthenticationClient';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { EventMessage, EventType } from '@azure/msal-browser';
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
    // private msalService: MsalService,
    // private broadcastService: MsalBroadcastService,
    private iab: InAppBrowser
  ) {
    super(null, null, communicator, menu, platform, router, null, null, null);

    // this.msalService.instance.setNavigationClient(
    //   new NavigationAuthenticationClient(this.platform, this.iab)
    // );
    platform.ready().then(async () => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // Redirect back to app after authenticating
      (window as any).handleOpenURL = (url: string) => {
        //Auth0Cordova.onRedirectUri(url);
      };
    });
  }

  override async ngOnInit() {
    console.log('ngOnInit AppComponent');
    await this.storage.create();
    // await this.msalService.instance.initialize();
    this.listenPropertiesLoadedEvent();
    this.listenLoginEvent();
    this.listenLogOutEvent();

    // this.broadcastService.msalSubject$
    //   .pipe(
    //     filter(
    //       (msg: EventMessage) =>
    //         msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
    //         msg.eventType === EventType.LOGIN_SUCCESS
    //     ), //
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe(async (result: EventMessage) => {
    //     console.log('Msal result', result);
    //     // userInfo,
    //     // provider: string,
    //     // token: string = null,
    //     // refreshToken: string = null

    //     // user.displayName = userInfo.displayName;
    //     // user.email = userInfo.email;
    //     // user.emailVerified = userInfo.emailVerified;
    //     // user.photoUrl = userInfo.photoURL;
    //     // user.uid = userInfo.uid;
    //     const userInfo = {
    //       displayName: result.payload?.['account']?.name ?? '',
    //       email: result.payload?.['account']?.username ?? '',
    //       emailVerified: true,
    //       photoUrl: '',
    //       uid: result.payload?.['account']?.tenantId ?? '',
    //     };
    //     console.log('Msal lgoin toekn ');
    //     const token = `eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJ2ZXIiOiIxLjAiLCJpc3MiOiJodHRwczovL2NvZ25pdGl2ZWdlbmVyYXRpb25lbnRlcnByLmIyY2xvZ2luLmNvbS8wMDMxOTYzMS03MWZhLTQzMWMtYTJkOC0wNjJjMjQ3ZmVlNmQvdjIuMC8iLCJzdWIiOiI4ZjM2MGFkOC1mMGI2LTRjNjctOWIxMy0wZGQxYzI3MDMzYWYiLCJhdWQiOiIyMzZjOTQ1Ni1kYTMyLTRjMmMtODFiNC04NDJkZmQwNDQyZjEiLCJleHAiOjE2OTQ0NjY1MzgsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNjk0NDYyOTM4LCJhdXRoX3RpbWUiOjE2OTQ0NjI5MzgsIm5hbWUiOiJBc2FkIEphbGlsIiwiaWRwIjoiZ29vZ2xlLmNvbSIsIm9pZCI6IjhmMzYwYWQ4LWYwYjYtNGM2Ny05YjEzLTBkZDFjMjcwMzNhZiIsIm5ld1VzZXIiOnRydWUsImVtYWlscyI6WyJhc2FkQGtvZHhzeXN0ZW0uY29tIl0sInRmcCI6IkIyQ18xX1NpZ25VcFNpZ25Jbl9QdWJsaWNfSG9tZWFaWm9uIiwibmJmIjoxNjk0NDYyOTM4fQ.JTnic-rcnqNIjhCuoXzUuLVGU-QtuGO67Rm1PWbHF1fyDp0ySI49f1fF-90DoMplUo-t8GtOGgherYidrVDj8mKd36hUkVlJqagMMjvFvEj9TbTeebYSpPb7De2joCt7hEp4IzA0K22KPyjgl93N8IZ-UvoIHmpj6Sd3PHBYOQGgRclwq2dMHrbpTbylIgC7-bMu-xo9n5b5vKKuvAWPNNutfaj5QjOLj-Y7FrJDCHRczSgN17baa4no7bJ52Ahsy9YkTUfA-nshUZTjB8T8D_7ojDR9tOLKxPZbO0NSv8qWYT6Z21eQbeYe4eg9qZ54w3KVIHzqUHhGO5edu3MeWA`;
    //     console.log(token);

    //     this.firebaseService.setUser(userInfo, 'microsoft', token, '');
    //   });

    this.pages = [
      {
        image:
          'https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fsign-out.svg?alt=media&token=af90963a-a5fa-418b-8411-f985318dce62',
        title: 'Logout',
        url: 'logout',
      },
      {
        image:
          'https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fatom.svg?alt=media&token=9061a8cf-0245-4efe-83ab-f6caa51695fd',
        title: 'Settings',
        url: 'settings',
      },
      {
        image:
          'https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fcorn.svg?alt=media&token=9bde19a2-7ea0-4b22-85df-47fac1703b2f',
        title: 'Notifications',
        url: 'notifications',
      },
      {
        image:
          'https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fuser-friends.svg?alt=media&token=8288f72c-046b-4ec5-b44e-7aa63b8e2e7d',
        title: 'User Types',
        url: 'user-types-manager',
      },
      {
        image:
          'https://firebasestorage.googleapis.com/v0/b/homeazzon.appspot.com/o/common%2Ffont-awesome%2Fregular%2Fquestion.svg?alt=media&token=caebe366-1fa4-49b7-a654-ef2143635700',
        title: 'Help',
        url: 'help',
      },
    ];
  }

  async listenLoginEvent(): Promise<void> {
    window.addEventListener('user:loggedIn', (x: any) => {
      this.displayName = this.firebaseService.FirebaseUser.displayName;
      this.router.navigate(['dashboard']);
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
        this.displayName = this.firebaseService.FirebaseUser.displayName;
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
    //this.appCtrl.getRootNav().push(PrivateLabelProfilePage, { showBackButton: true });
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
    localStorage.removeItem('Lineitems');
    this.menu.close('propertyMenu');
  }
}
