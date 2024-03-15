import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import {
  AlertController,
  LoadingController,
  MenuController,
  Platform
} from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { IPropertyDto } from './models/dto/interfaces/IPropertyDto';
import { BasePage } from './pages/base/base.page';
import { AppStorageService } from './services/app-storage/app-storage.service';
import { CommunicatorService } from './services/communicator/communicator.service';
import { Subject } from 'rxjs';
import { Constants } from 'src/app/common/Constants';
import { AccountService } from './services/account/account.service';
import { FirebaseAuthService } from './services/FirebaseAuth/firebase-auth.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LocalStorageService } from './services/local-storage.service';
import { UtilitiesService } from './services/utlities/utilities.service';
import { AzureAuthService } from './services/azure-auth/azure-auth.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent extends BasePage {
  public appVersion: string = '13.2.0';
  private readonly _destroying$ = new Subject<void>();
  private _loading: any;

  public rootPage: any;
  public isIos: boolean = false;

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
  tempUserProperties: any = [];
  userProperties: any = [];
  getPropertiesSubsription: any;
  constants = new Constants();
  privateLabeler: any; // TODO: Should be IPrivateLabelDto or IPrivateLabelerDto
  privateLabelerModifiedName: string;

  //new
  constructor(public override platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: Storage,
    private alertCtrl: AlertController,
    public http: HttpClient,
    public override communicator: CommunicatorService,
    public menu: MenuController,
    private storageCtrl: AppStorageService,
    public loadingController: LoadingController,
    public override router: Router,
    private ngzone: NgZone,
    private firebaseService: FirebaseAuthService,
    private iab: InAppBrowser,
    public override storageService: LocalStorageService,
    private accountService: AccountService,
    private utilityService: UtilitiesService,
    private azureAuthService: AzureAuthService,
    private ngZone: NgZone) {
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

      this.isIos = this.platform.is('ios');
    });
  }

  compareAppVersions(version1: string, version2: string): number {
    const splitV1 = version1.split('.').map(Number);
    const splitV2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(splitV1.length, splitV2.length); i++) {
      const num1 = splitV1[i] || 0;
      const num2 = splitV2[i] || 0;

      if (num1 > num2) return 1; // version1 is greater
      if (num2 > num1) return -1; // version2 is greater
    }
    return 0; // versions are equal
  }

  override async ngOnInit() {
    console.log('ngOnInit AppComponent');
    await this.storage.create();
    this.storageService.delete('ActiveProperty');

    await this.utilityService.getRequiredMinimumVersion().then(async (x: any) => {
      const a: number = this.compareAppVersions(this.appVersion, x.RequiredMinimumVersion);

      if (a < 0) {
        this._loading = await this.loadingController.create({
          message: 'New Version Available! Visit the App Store to download or use the web "www.mobile.web.homeazzon.com"',
          cssClass: 'my-loading-class',
        });

        await this._loading.present();
      }
    }).catch((err: any) => {
      //debugger;
    });

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
        url: 'notification-list',
      },
      {
        image:
          '../assets/icon/question.svg',
        title: 'Help',
        url: 'help',
      },
      // {
      //   image:
      //     '../assets/icon/Setting.svg',
      //   title: 'Settings',
      //   url: 'settings',
      // },
      {
        image:
          '../assets/svgs/light/list.svg',
        title: 'Menu',
        url: 'interstatial',
      },
    ];
  }

  ngAfterViewInit() {
    let p = this.Properties;

    if (p !== undefined && p !== null && p.length > 0) {
      this.setUserProperties(p);
    }

  }

  // TODO: Remove
  async listenLoginEvent(): Promise<void> {
    window.addEventListener('user:loggedIn', (x: any) => {

      if (this.User?.UserName?.length) {
        this.displayName = this.User.UserName;
      } else {
        this.accountService.getUser().then((user) => {
          this.User = user;
          this.displayName = this.User.UserName;
        }).catch((e) => { });
      }

      this.ngZone.run(() => {
        this.router.navigate(['login-success']);
      });
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
      const that = this;

      this.ngzone.run(() => {
        if (x.detail === undefined
          || x.detail === null
          || x.detail.length == 0) {
          let p = that.Properties;
          this.tempUserProperties = p;
        } else {
          this.tempUserProperties = x.detail;
        }

        console.log('loading properties', this.tempUserProperties);

        this.setUserProperties(this.tempUserProperties);
      });
    });
  }

  private setUserProperties(userProperties: any) {
    this.displayName = this.User.UserName;
    let userTypes = this.UserTypes;

    //let _ = userProperties.filter((x: any) => x.toLowerCase().indexOf('privatelabel') === -1);
    let _ = userProperties;
    _.map((x: any) => {
      let _u = userTypes.filter((y: any) => y.Id == x.UserTypeId);

      if (_u?.length) {
        if (_u[0].Name === undefined || _u[0].Name === null) {
          debugger;
        }
        this.setPropertyImage(_u[0].Name, x);
      }
    });

    // Find the index of the item where IsDefault is true
    const defaultIndex = _.findIndex(item => item.IsDefault);

    // If such an item is found and it's not already the first element
    if (defaultIndex > 0) {
      // Remove the item from its current position
      const [defaultItem] = _.splice(defaultIndex, 1);

      // Add it to the beginning of the array
      _.unshift(defaultItem);
    }

    this.userProperties = _;

    console.log('set properties');
    var a = this.User;

    if (a.IsPrivateLabelUser) {
      this.isPrivateLabelUser = true;
      let b: any = a.PrivateLabeler;
      let c = this.getWordsWithinLimit(b.Name, 15);
      this.privateLabelerModifiedName = c;
      this.privateLabeler = b;
      console.log('privateLabeler', this.privateLabeler);
      console.log('b', b);
    }
  }

  private setPropertyImage(userType: string, property: any) {

    var imageName: string = '';

    if (userType.toLowerCase().indexOf('tradesman') > -1) {
      imageName = 'tradesman';
    }
    if (userType.toLowerCase().indexOf('privatelabel') > -1) {
      imageName = 'private-label';
    }
    if (userType.toLowerCase().indexOf('owner') > -1) {
      imageName = 'owner';
    }
    if (userType.toLowerCase().indexOf('developer') > -1) {
      imageName = 'property-developer';
    }
    if (userType.toLowerCase().indexOf('appraiser') > -1) {
      imageName = 'appraiser';
    }
    if (userType.toLowerCase().indexOf('architect') > -1) {
      imageName = 'architect';
    }
    if (userType.toLowerCase().indexOf('bank') > -1) {
      imageName = 'bank';
    }
    if (userType.toLowerCase().indexOf('realtor') > -1) {
      imageName = 'realtor';
    }
    if (userType.toLowerCase().indexOf('vendor') > -1) {
      imageName = 'vendor';
    }
    if (userType.toLowerCase().indexOf('gamer') > -1) {
      imageName = 'gamer';
    }

    property.Image = `assets/icon/${imageName}.svg`;
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
              // this.firebaseService.logOut();
              this.azureAuthService.logout().then(() => {
                this.storageService.clear();
                this.storage.clear();
                window.dispatchEvent(new CustomEvent('user:loggedOut'));
                this.router.navigate(['sign-in']);
                return true;
              });
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

  public seePrivateLabelerProperties() {
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

  async stopScan(): Promise<void> {
    await BarcodeScanner.stopScan();
    document.body.classList.remove("qrscanner");
    // BarcodeScanner.prepare();
    this.router.navigate(['dashboard']);
    // this.uxNotifierService.showToast("There was an error scanning the barcode/qr code!", this.constants.ToastColorBad);
  }

  getWordsWithinLimit(sentence: string, characterLimit: number): string {
    const words = sentence.split(' ');
    let result = '';
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length <= characterLimit) {
        result += word + ' ';
        currentLength += word.length + 1;
      } else {
        break;
      }
    }

    return result.trim();
  }
}
