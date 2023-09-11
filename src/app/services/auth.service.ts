// src/app/services/auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
// import { NavigationAuthenticationClient } from "./navigationAuthenticationClient";
import { MsalService } from '@azure/msal-angular';
import { Platform } from '@ionic/angular';

declare let cordova: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken: string;
  user: any;
  loggedIn: boolean;
  loading = true;

  constructor(
    public zone: NgZone,
    private storage: Storage,
    private msalService: MsalService,
    private platform: Platform
  ) {
    this.getStorageInformation();
  }

  private getStorageInformation() {
    this.storage.get('profile').then((user) => (this.user = user));
    this.storage
      .get('access_token')
      .then((token) => (this.accessToken = token));
    this.storage.get('expires_at').then((exp) => {
      if (exp != null) {
        this.loggedIn = Date.now() < JSON.parse(exp);
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  removeIntractionInProgressMsal() {
    if (this.platform.is('android')) {
      this.msalService.instance.handleRedirectPromise();
    }
    sessionStorage.removeItem('msal.interaction.status');
  }

  login() {
    this.loading = true;
    this.removeIntractionInProgressMsal();
    this.msalService.loginRedirect({
      scopes: ['openid', 'profile'],

      redirectStartPage: 'http://localhost:8100',
      prompt: 'select_account',
    });

    // Authorize login request with Auth0: open login page and get auth results
    // this.Client.authorize(options, (err, authResult) => {
    //   if (err) {
    //     this.zone.run(() => (this.loading = false));
    //     throw err;
    //   }
    //   // Set access token
    //   this.storage.set("access_token", authResult.accessToken);
    //   this.accessToken = authResult.accessToken;
    //   // Set access token expiration
    //   const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    //   this.storage.set("expires_at", expiresAt);
    //   // Set logged in
    //   this.loading = false;
    //   this.loggedIn = true;
    //   // Fetch user's profile info
    //   this.Auth0.client.userInfo(this.accessToken, (err, profile) => {
    //     if (err) {
    //       throw err;
    //     }
    //     this.storage.set("profile", profile).then((val) => this.zone.run(() => (this.user = profile)));
    //   });
    // });
  }

  logout() {
    this.accessToken = null;
    this.user = null;
    this.loggedIn = false;
    // this.safariViewController.isAvailable().then((available: boolean) => {

    // });
  }
}
