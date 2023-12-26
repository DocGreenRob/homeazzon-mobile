import { Location } from "@angular/common";
import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../base/base.page';
import { Constants } from "../../../../common/Constants";
import { LocalStorageService } from "../../../../services/local-storage.service";
import { LoadingController, Platform } from "@ionic/angular";
import { NotificationService } from "../../../../services/notification/notification.service";
import { UxNotifierService } from "../../../../services/uxNotifier/ux-notifier.service";

@Component({
  selector: 'app-notification-details',
  templateUrl: './notification-details.page.html',
  styleUrls: ['./notification-details.page.scss'],
})
export class NotificationDetailsPage extends BasePage {
  private _constants: Constants;
  private _loading: any;
  public notifications: any;
  public notification: any;

  constructor(public override storageService: LocalStorageService,
    private location: Location,
    private loadingController: LoadingController,
    private notificationService: NotificationService,
    public override uxNotifierService: UxNotifierService,
    public override platform: Platform) {
    super(null,
      null,
      null,
      null,
      platform,
      null,
      uxNotifierService,
      null,
      null,
      null,
      storageService);

    this._constants = new Constants();
  }

  override async ngOnInit() {
    let _ = this.Notification;
    this.notification = _;
  }

  public close() {
    this.location.back();
  }

  override ionViewDidLoad() {
    console.log(this.notification);
    console.log("ionViewDidLoad AuthorizerPage");
  }

}
