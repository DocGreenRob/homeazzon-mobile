import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// TODO: remove the '../../..' and use the "~" or whatever
// TODO: remove the " and use '
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SafariViewController } from '@awesome-cordova-plugins/safari-view-controller/ngx';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { environment } from '@env';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Constants } from 'src/app/common/Constants';
import { Credential } from 'src/app/models/Credential';
import { ICompanyTypeDto } from 'src/app/models/dto/interfaces/ICompanyTypeDto';
import { BasePage } from 'src/app/pages/base/base.page';
import { AccountService } from 'src/app/services/account/account.service';
import { CompanyTypesService } from 'src/app/services/company-types/company-types.service';
import { FirebaseAuthService } from 'src/app/services/FirebaseAuth/firebase-auth.service';
import { PrivateLabelService } from 'src/app/services/private-label/private-label.service';
import { UserDetailsService } from 'src/app/services/user-details/user-details.service';
import { UxNotifierService } from 'src/app/services/uxNotifier/ux-notifier.service';
import { IUserDto } from '../../../../models/dto/interfaces/IUserDto';
import { IUserTypeDto } from '../../../../models/dto/interfaces/IUserTypeDto';
import { FirebaseUser } from '../../../../models/FirebaseUser';
import { AuthService } from '../../../../services/auth.service';
import { UserTypesService } from '../../../../services/user-types/user-types.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage extends BasePage {
  private constants: Constants;

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private safariViewController: SafariViewController,
    private deeplinks: Deeplinks,
    private authService: AuthService,
    // ionic
    public override platform: Platform,
    private storage: Storage,
    // angular
    public override router: Router,
    private route: ActivatedRoute,
    // framework controllers
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public override navController: NavController,
    public modalCtrl: ModalController,
    public override menuController: MenuController,
    public toastCtrl: ToastController,
    // services
    private accountService: AccountService,
    private companyTypesService: CompanyTypesService,
    private privatelabelService: PrivateLabelService,
    private userService: UserDetailsService,
    private iab: InAppBrowser,
    public override userTypesService: UserTypesService,
    public override uxNotifierService: UxNotifierService,
    private firebaseAuthService: FirebaseAuthService
  ) {
    super(
      navController,
      null,
      null,
      null,
      platform,
      router,
      uxNotifierService,
      userTypesService,
      null
    );
    this.constants = new Constants();
    this.initializeApp();

    this.AppInsights.trackEvent({
      name: 'SignInPage.Constructor()',
      properties: [{}],
    });
    //this.generateChallenge();

    localStorage.removeItem('IsPropertiesFetched');
    localStorage.removeItem('ProfileItem');
    localStorage.removeItem('Metattachments');
    localStorage.removeItem('User');
    localStorage.removeItem('ProfileItemLineItems');
    localStorage.removeItem('IsMetattachment');
    localStorage.removeItem('ActiveItem');
    localStorage.removeItem('LineItem');
    localStorage.removeItem('Lineitems');
    localStorage.removeItem('Properties');
    localStorage.removeItem('ActiveAttachmentItem');
    localStorage.removeItem('CurrentView');
  }

  override async ngOnInit() {
    console.log('ionViewDidLoad SigninPage');

    this.AppInsights.trackEvent({
      name: 'SignInPage.ngOnInit()',
      properties: [{}],
    });
    //this.AppInsights.trackPageView({ name: 'SigninPage' });

    this.menuController.enable(false, 'propertyMenu');
    this.menuController.enable(false, 'mainMenu');

    await this.getCompanyTypeInformation();
    await this.getUserTypes();
  }

  async signInAzure() {
    const url = environment.azureB2CUrl;

    this.iab.create(url, '_system', {});
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      console.log('that is the reps');
      console.log(event.url);
      this.firebaseAuthService.browserLoginHandler(event.url);
    });
  }

  loginHandler() {
    console.log('this.route.snapshot.queryParams');
    console.log(this.route.snapshot);
    if (this.route.snapshot.fragment) {
      const tokenId = this.route.snapshot.fragment
        .toString()
        .split('id_token=')
        .pop();
      console.log(tokenId);

      var decodedToken = this.decodeToken(tokenId);
      //debugger;

      console.log('decodedToken', decodedToken);

      this.next();
      //this.firebaseAuthService.setUser(userInfo, 'microsoft', tokenId, '');
    }
  }

  decodeToken(token: string): any {
    // somewhere in your code...
    try {
      const decodedToken = jwt_decode(token);
      if (decodedToken) {
        // Handle decoded token here...
        console.log('JWT claims:', decodedToken);
      } else {
        console.log('Failed to decode JWT token');
      }
    } catch (error) {
      console.log('Error decoding JWT token:', error);
    }
  }

  private async getCompanyTypeInformation() {
    // load the company types (if they aren't in local storage)
    let areCompanyTypesInLocalStorage = false;
    // TODO: move to Base class
    // TODO: move most, if not all storage stuff to Base class
    this.storage.get('CompanyTypes').then((x) => {
      if (x && x == true) {
        areCompanyTypesInLocalStorage = true;
      }
    });

    this.AppInsights.trackEvent({
      name: 'SignInPage.getCompanyTypeInformation()',
      properties: [
        {
          areCompanyTypesInLocalStorage: areCompanyTypesInLocalStorage,
        },
      ],
    });

    if (!areCompanyTypesInLocalStorage) {
      this.companyTypesService.getCompanyTypes().subscribe((x: any) => {
        this.CompanyTypes = x.map((a: any) => {
          let b: ICompanyTypeDto = {} as ICompanyTypeDto;
          b.Id = a.Id;
          b.Name = a.Name;
          return b;
        });
        this.storage.set('CompanyTypes', x);

        this.AppInsights.trackEvent({
          name: 'SignInPage.getCompanyTypeInformation().companyTypesService.getCompanyTypes(): success',
          properties: [
            {
              CompanyTypes: x,
            },
          ],
        });
      });
    }
  }

  private async getUserTypes() {
    this.userTypesService
      .getAllUserTypes()
      .subscribe((response: Array<IUserTypeDto>) => {
        let userTypes = response;
        this.UserTypes = userTypes;
        console.log(this.UserTypes);
      });
  }

  private async getUser() {
    await this.accountService
      .getUser()
      .then(async (x: IUserDto) => {
        if (x === undefined || x === null) {
          const user: any = {
            Email: this.firebaseAuthService.FirebaseUser.email,
            Types: [{ Id: 0, IsActive: null, Name: 'Owner' }], //TODO: need to not default to owner, maybe here need to ask user for their type
            // and then go into other registration screens (give option to save for later)
            FullName: this.firebaseAuthService.FirebaseUser.displayName,
            Provider: this.firebaseAuthService.FirebaseUser.provider,
            ProviderUniqueId: this.firebaseAuthService.FirebaseUser.uid,
          };

          await this.accountService
            .signUp(user)
            .then(async (x) => {
              await this.refreshUser();
            })
            .catch(async (e) => {
              this.AppInsights.trackEvent({
                name: 'SignInPage.next().getUser().accountService().catch()',
                properties: [{ Error: e.message }],
              });
              throw e;
            });
        } else {
          this.User = x;
        }
      })
      .catch((e) => {
        console.log('error', e);
        this.AppInsights.trackEvent({
          name: 'SignInPage.next().getUser().catch()',
          properties: [{ Error: e.message }],
        });
      });
  }

  async refreshUser() {
    await this.accountService
      .getUser()
      .then(async (x: IUserDto) => {
        this.User = x;
      })
      .catch((e) => {
        console.log('error', e);
        this.AppInsights.trackEvent({
          name: 'SignInPage.refreshUser().getUser().catch()',
          properties: [{ Error: e.message }],
        });
      });
  }

  async next() {
    if (
      this.User === undefined ||
      this.User === null ||
      this.User.Email === undefined ||
      this.User.Email === null ||
      this.User.Email === ''
    ) {
      await this.refreshUser()
        .then(async () => {
          await this.finish();
        })
        .catch((e) => {
          console.log('error', e);
          this.AppInsights.trackEvent({
            name: 'SignInPage.next().getUser().catch()',
            properties: [{ Error: e.message }],
          });
        });
    } else {
      await this.finish();
    }
  }

  async finish() {
    this.router.navigate(['dashboard']);
  }
}
