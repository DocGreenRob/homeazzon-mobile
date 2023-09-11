import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseAuthService } from 'src/app/services/FirebaseAuth/firebase-auth.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.page.html',
  styleUrls: ['./redirect.page.scss'],
})
export class RedirectPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private firebaseAuthService: FirebaseAuthService
  ) {}

  ngOnInit() {
    this.loginHandler();
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

      const userInfo = {
        displayName: 'Rizwan',
        email: 'rizwan@gmail.com',
        emailVerified: true,
        photoUrl: '',
        uid: '12312',
      };
      console.log('Msal lgoin toekn ');

      console.log(tokenId);

      this.firebaseAuthService.setUser(userInfo, 'microsoft', tokenId, '');
    }
  }
}
