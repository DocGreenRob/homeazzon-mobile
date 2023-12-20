import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { IAuthTokenDto } from '../../models/dto/interfaces/IAuthTokenDto';
import { IUserDto } from '../../models/dto/interfaces/IUserDto';
import { AccountService } from '../../services/account/account.service';
import { BasePage } from '../base/base.page';
import { LocalStorageService } from '@app/services/local-storage.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})
export class RedirectPage extends BasePage {
  private _token: string = '';
  constructor(
    private route: ActivatedRoute,
    public override router: Router,
    // services
    private accountService: AccountService,
    public override storageService: LocalStorageService
  ) {
    super(
      null,
      null,
      null,
      null,
      null,
      router,
      null,
      null,
      null,
      null,
      storageService
    );
  }

  override ngOnInit() {
    this.loginHandler();
  }

  loginHandler() {
    if (this.route.snapshot.fragment) {
      this.xyz(
        this.route.snapshot.fragment
      );
    }
    this.next();
  }

  xyz(response: string) {
    const tokenId = response?.toString()?.split('id_token=')?.pop();
    const decodedToken = jwt_decode(tokenId);
    console.log('claims', decodedToken);

    const userInfo = {
      displayName: decodedToken['name'],
      email: decodedToken['emails'][0],
      emailVerified: true,
      photoUrl: '',
      uid: decodedToken['oid'],
    };

    const myAuthToken: IAuthTokenDto = {};
    myAuthToken.Access_token = tokenId;
    myAuthToken.Expires = Date.now() + 9548798453100;
    myAuthToken.Expires_in = 9086400;
    this.AuthToken = myAuthToken;
  }

  next() {
    if (
      this.User === undefined ||
      this.User === null ||
      this.User.Email === undefined ||
      this.User.Email === null ||
      this.User.Email === ''
    ) {
      this.refreshUser()
        .then(() => {
          this.finish();
        })
        .catch((e) => {
          console.log('error', e);
          this.AppInsights.trackEvent({
            name: 'SignInPage.next().getUser().catch()',
            properties: [{ Error: e.message }],
          });
        });
    } else {
      this.finish();
    }
  }

  finish() {
    window.dispatchEvent(new CustomEvent('user:loggedIn'));
  }

  async refreshUser() {
    await this.accountService.getUser()
      .then(async (x: IUserDto) => {
        this.User = x;
        console.log(`User set: ${this.User}`);
        console.log(this.User);
      })
      .catch((e) => {
        console.log('error', e);
        this.AppInsights.trackEvent({
          name: 'SignInPage.refreshUser().getUser().catch()',
          properties: [{ Error: e.message }],
        });
      });
  }
}
