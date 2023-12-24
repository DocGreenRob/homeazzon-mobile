import { Location } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../base/base.page';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { LoadingController } from "@ionic/angular";
import { NotificationService } from "../../../../services/notification/notification.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";
import { Constants } from "../../../../common/Constants";

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.page.html',
  styleUrls: ['./authorize.page.scss'],
})
export class AuthorizePage extends BasePage {
  private _constants: Constants;
  private _loading: any;
  public notification: any;

  constructor(public override storageService: LocalStorageService,
    private location: Location,
    private loadingController: LoadingController,
    private notificationService: NotificationService,
    public override uxNotifierService: UxNotifierService,) {
    super(null,
      null,
      null,
      null,
      null,
      null,
      uxNotifierService,
      null,
      null,
      null,
      storageService
    );

    this._constants = new Constants();  
  }

  override async ngOnInit() { }

  public close() {
    this.location.back();
  }

  override ionViewDidLoad() {
    console.log(this.notification);
    console.log("ionViewDidLoad AuthorizerPage");
  }

  public async authorize(action) {
    this._loading = await this.loadingController.create({
      message: 'approving...',
      cssClass: 'my-loading-class',
    });
    await this._loading.present();

    this.notificationService.approveAuthorization(action, this.notification.PendingAuthorization.Id).then((response) => {
        this._loading.dismiss();
        this.uxNotifierService.showToast(action + " was applied successfully", this._constants.ToastColorBad);
        
        if (action === 'limitedAccess') {
        	this.router.navigate(["limited-access"]);
        } else {
          this.router.navigate(["dashboard"]);
        }
      },
        (err) => {
          this.uxNotifierService.showToast("An error occured.Please try again later.", this._constants.ToastColorBad);
        }
      );
  }

  dismiss() {
    //this.viewCtrl.dismiss();
  }

  //check notification as opened
  checkAsOpened(action) {
    this.notificationService.checkAsOpened(this.notification.callID).then(() => {
      this.authorize(action);
    },
      (err) => {
        this.uxNotifierService.showToast("An error occured.Please try again later.", this._constants.ToastColorBad);
      }
    );
  }
}
