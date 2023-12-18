import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@app/services/local-storage.service';
//import { MsalService } from '@azure/msal-angular';
import { Storage } from '@ionic/storage';
import { BasePage } from 'src/app/pages/base/base.page';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
})
export class IndexPage extends BasePage {
  loader: any;

  constructor(
    public override router: Router,
    public storage: Storage,
    private accountService: AccountService,
    private http: HttpClient,
    public override storageService: LocalStorageService
    //private msalService: MsalService
  ) {
    super(null, null, null, null, null, router, null, null, null,null,storageService);
  }

  override async ngOnInit() {
    // debugger;
    //await this.msalService.instance.handleRedirectPromise();
    console.log('ngOnInit IndexPage');
  }

  ionViewWillEnter(): void {
    this.isLoggedIn();
  }

  private isLoggedIn() {
    let isValidUser = this.accountService.isAuthTokenValid();

    if (isValidUser) {
      if (this.User === undefined || this.User === null) {
        this.accountService
          .getUser()
          .then((x) => {
            this.User = x;
            this.next();
          })
          .catch((e) => {});
      } else {
        this.next();
      }
    } else {
      this.router.navigate(['splash']);
    }
  }

  private next() {
    this.router.navigate(['dashboard']);
  }
}
