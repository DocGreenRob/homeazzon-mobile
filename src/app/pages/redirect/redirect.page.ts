import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { IUserDto } from '../../models/dto/interfaces/IUserDto';
import { AccountService } from '../../services/account/account.service';
import { BasePage } from '../base/base.page';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})
export class RedirectPage extends BasePage {
  constructor(
    private route: ActivatedRoute,
    public override router: Router,
    // services
    private accountService: AccountService,
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
      null
    );
  }

  override ngOnInit() {
    this.next();
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
    debugger;
    window.dispatchEvent(new CustomEvent('user:loggedIn'));
  }

  async refreshUser() {
    await this.accountService
      .getUser()
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
