import { Injectable } from '@angular/core';
import { baseService } from '../base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends baseService {
  constructor(public override http: HttpClient) {
    super(http);
  }

  async getUserNotifications(){
    return this.get(`/notification`).toPromise();
  }

  async checkAsOpened(notificationID){
    return this.get(`/authorization/senderNotificationOpened/${notificationID}`).toPromise();
  }

  async checkApprovedOpened(notificationID){
    return this.get(`/event/opened/${notificationID}`).toPromise();
  }

  async approveAuthorization(action, notificationId) {
    return this.get(`/authorization/${action}/${notificationId}`).toPromise();
  }

  async deniedAuthorizationEventOpened(notificationID) {
    return this.get(`/authorization/denyAccessNotificationOpened/${notificationID}`).toPromise();
  }
}
