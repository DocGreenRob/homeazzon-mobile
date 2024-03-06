import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../base/base.page';
import { CommunicatorService } from '../../../../services/communicator/communicator.service';
import { AlertController, LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { UserTypesService } from '../../../../services/user-types/user-types.service';
import { UxNotifierService } from '../../../../services/uxNotifier/ux-notifier.service';
import { FeaturesService } from '../../../../services/features/features.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { Router } from '@angular/router';
import { Constants } from '../../../../common/Constants';
import { UtilitiesService } from '../../../../services/utlities/utilities.service';
import { AzureAuthService } from '../../../../services/azure-auth/azure-auth.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage extends BasePage {
  private _constants: Constants;
  private _loading: any;

  public isIos: boolean = false;
  spinnerText: string = 'Loading...';
  loading1Visible: boolean = false;
  constructor(public override navController: NavController,
    public override communicator: CommunicatorService,
    public override menuController: MenuController,
    public override platform: Platform,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    public override userTypesService: UserTypesService,
    public override featuresService: FeaturesService,
    public override inAppBrowser: InAppBrowser,
    public override storageService: LocalStorageService,
    private alertCtrl: AlertController,
    private utilityService: UtilitiesService,
    private azureAuthService: AzureAuthService,
    public storage: Storage,
    private loadingCtrl: LoadingController) {
    super(navController, null, communicator, menuController, platform, router, uxNotifierService, userTypesService, featuresService, inAppBrowser, storageService);
    this._constants = new Constants();
    this.isIos = this.platform.is('ios');
  }

  override ngOnInit() { }

  public close() {
    this.router.navigate(["dashboard"]);
  }

  public async deleteAccount() {
    this.confirmDeleteAccount();
  }

  private async confirmDeleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure want to delete your account?',
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
          handler: async () => {


            this.presentSpinner('deleting account...');
            this.utilityService.deleteAccount().then(() => {
              this.azureAuthService.logout().then(() => {
                this.storageService.clear();
                this.storage.clear();
                window.dispatchEvent(new CustomEvent('user:loggedOut'));

                if (this._loading != undefined) {
                  this.dismissSpinner();
                }

                this.router.navigate(['sign-in']);
                return true;
              });
              this.uxNotifierService.showToast("Account deleted successfully!", this._constants.ToastColorGood);
            });
          },
        },
      ],
    });

    await alert.present();

    return;
  }
  async presentSpinner(text: string) {
    this.spinnerText = text;
    this.loading1Visible = true;
  }

  async dismissSpinner() {
    this.loading1Visible = false;
    this.spinnerText = ''; 
  }
}
