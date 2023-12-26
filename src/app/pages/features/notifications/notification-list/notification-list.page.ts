import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../base/base.page';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { NotificationService } from '../../../../services/notification/notification.service';
import { UxNotifierService } from '../../../../services/uxNotifier/ux-notifier.service';
import { Constants } from '../../../../common/Constants';
import { AuthorizePage } from '../../suggestions/authorize/authorize.page';
import { NotificationDetailsPage } from '../notification-details/notification-details.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.page.html',
  styleUrls: ['./notification-list.page.scss'],
})
export class NotificationListPage extends BasePage {
  private _constants: Constants;
  private _loading: any;
  public notifications: any;
  public notification: any;

  constructor(public override storageService: LocalStorageService,
    private location: Location,
    private loadingController: LoadingController,
    private notificationService: NotificationService,
    public override uxNotifierService: UxNotifierService,
    public override platform: Platform,
    private modalController: ModalController,
    public override router: Router,) {
    super(null,
      null,
      null,
      null,
      platform,
      router,
      uxNotifierService,
      null,
      null,
      null,
      storageService);

    this._constants = new Constants();
  }

  override async ngOnInit() {
    this.notifications = [
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Invitation', Sender: 'John Doe', IsOpened: false, PendingAuthorization: { Date: '12/24/2023', Property: { Customer: { Name: 'Sarah Suruh' }, StreetAddress1: '400 NW 1st Ave', City: 'Miami', State: 'FL' } } },
      { Date: '2023-04-02', theType: 'LimitedAccessAreaAccessRemoved', Type: 'LimitedAccessAreaAccessGranted', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'DeniedAuthorization', Type: 'DeniedRequestAuthorization', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Invitation', Sender: 'John Doe', IsOpened: true },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Invitation', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Invitation', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: true },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: false },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: true },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: true },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: false },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: true },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: false },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: true },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      { Date: '2023-04-01', theType: 'PendingAuthorization', Type: 'Message', Sender: 'John Doe', IsOpened: true },
      { Date: '2023-04-02', theType: 'PendingAuthorization', Type: 'Alert', Sender: 'Jane Smith', IsOpened: false },
      { Date: '2023-04-03', theType: 'PendingAuthorization', Type: 'Update', Sender: 'Acme Inc.', IsOpened: false },
      // ... add as many objects as needed to see the rendering
    ];

  }

  public close() {
    this.location.back();
  }

  override ionViewDidLoad() {
    console.log(this.notification);
    console.log('ionViewDidLoad AuthorizerPage');
  }

  private async getNotifications() {
    this._loading = await this.loadingController.create({
      message: 'approving...',
      cssClass: 'my-loading-class',
    });
    await this._loading.present();

    this.notificationService.getUserNotifications(this.navParams.get('userID')).then((response) => {
      this._loading.dismiss();
      this.notifications = response;
      console.log(this.notifications);

      for (let notification of this.notifications) {

        if (notification.PendingAuthorization !== undefined
          && notification.PendingAuthorization !== null
          && notification.DeniedAuthorizationRequest === null) {
          notification.callID = notification.PendingAuthorization.Id
          notification.theType = 'PendingAuthorization';
          //id = notification.PendingAuthorization.Id;
          ////notificationType = 
          //responseObj = notification.PendingAuthorization;
        }

        if (notification.DeniedAuthorizationRequest !== undefined && notification.DeniedAuthorizationRequest !== null) {
          notification.callID = notification.PendingAuthorization.Id
          notification.theType = 'DeniedAuthorization';
          //id = notification.PendingAuthorization.Id;
          //notificationType = 'DeniedAuthorization';
          //responseObj = notification.DeniedAuthorizationRequest.Event;
        }

        // set this here becuase the sender will be different for Private Labeler
        // TODO: Fix the Sender - requires architectural modifications
        //sender = notification.Sender;

        if (notification.PrivateLabelClone !== undefined && notification.PrivateLabelClone !== null) {

          notification.callID = notification.PrivateLabelClone.Id;
          notification.theType = 'PrivateLabelClone';
          // id = notification.PrivateLabelClone.Id;
          //notificationType = 'PrivateLabelClone';
          //responseObj = notification.PrivateLabelClone;
          notification.sender = 'see message';
        }

        //date = notification.Date;
        // subject = notification.Type;

        if (notification.Suggestion !== null) {

          notification.callID = notification.Suggestion.Id;
          notification.theType = 'Suggestion';

          notification.Sender = notification.Suggestion.Sender;
          notification.Date = notification.Suggestion.Date


        }
      }
    },
      error => {
        this._loading.dismiss();
      }
    );
  }

  viewFullNotification(notification) {
    let _ = this.Notification;
    _ = notification;
    this.Notification = _;

    //debugger;
    console.log(notification);

    let id = 0;

    if (notification.Type == 'Invitation' && notification.theType == 'PendingAuthorization') {
      id = notification.callID;
      this.openASenderNotification(notification, id);
    }
    else if (notification.PendingAuthorization != null && notification.DeniedAuthorizationRequest == null) {
      const modal = this.modalController.create(
        {
          component: NotificationDetailsPage,
          componentProps: notification
        }
      ).then((x) => {
        debugger;
      }).catch((err) => {

      });

    } else {
      console.log(notification);
      if (notification.Suggestion != null) {
        id = notification.Suggestion.Id;
        //call the event opened api 
        this.notificationEventOpened(id, notification)
      } else if (notification.PrivateLabelClone != null) {

        id = notification.PrivateLabelClone.Id;
        //call the event opened api 
        this.notificationEventOpened(id, notification)
      } else if (notification.Type == 'LimitedAccessAreaAccessGranted' || notification.Type == 'LimitedAccessAreaAccessRemoved') {

        id = notification.ApprovedAuthorization.Id;
        //call the event opened api 
        this.notificationEventOpened(id, notification)
      } else if (notification.Type == 'DeniedRequestAuthorization' && notification.theType == 'DeniedAuthorization') {
        id = notification.callID;
        this.deniedAuthorizationNotificationOpened(id, notification)
      } else if (notification.DeniedAuthorizationRequest = !null) {
        id = notification.callID;
        //call the event opened api 
        this.notificationEventOpened(id, notification)

      }
      else {
        id = notification.ApprovedAuthorization.Id;
        //call the event opened api 
        this.notificationEventOpened(id, notification)
      }
      console.log(id);

    }
  }

  notificationEventOpened(id, notification) {
    this.notificationService.checkApprovedOpened(id).then(() => {
      //const modal = this.modalCtrl.create(
      //  NotificationModalPage,
      //  notification
      //);
      //modal.onDidDismiss(() => {
      //  this.getNotifications();
      //});
      //modal.present();
    });
  }

  deniedAuthorizationNotificationOpened(id, notification) {
    this.notificationService.deniedAuthorizationEventOpened(id).then(() => {
      //const modal = this.modalCtrl.create(
      //  NotificationModalPage,
      //  notification
      //);
      //modal.onDidDismiss(() => {
      //  this.getNotifications();
      //});
      //modal.present();
    });

  }

  openASenderNotification(notification, id) {
    this.router.navigate(['notification-details']);
    //this.notificationService.checkAsOpened(id).then(() => {
    //  this.router.navigate(['notification-details']);
    //});
  }
}
