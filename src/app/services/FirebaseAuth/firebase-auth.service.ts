import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { Credential } from "src/app/models/Credential";
import { IAuthTokenDto } from "src/app/models/dto/interfaces/IAuthTokenDto";
import { IdTokenDto } from "src/app/models/dto/interfaces/IdTokenDto";
import { FirebaseUser } from "src/app/models/FirebaseUser";
import { Platform } from "@ionic/angular";
import { GooglePlus } from "@awesome-cordova-plugins/google-plus/ngx";
import { SignInWithApple, ASAuthorizationAppleIDRequest, AppleSignInResponse } from "@awesome-cordova-plugins/sign-in-with-apple/ngx";
import firebase from "firebase/compat/app";

@Injectable({
  providedIn: "root",
})
export class FirebaseAuthService {
  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private storage: Storage,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private appleSignIn: SignInWithApple,
    private ngZone: NgZone
  ) {
    this.listenAuthStateChange();
  }

  listenAuthStateChange() {
    this.auth.authState.subscribe(async (x) => {
      if (x) {
        let provider = "password";

        if (x.providerData.length > 0) {
          provider = x.providerData[0].providerId;
        }
        await x.getIdToken().then((k) => {
          this.setUser(x, provider, k, x.refreshToken);
        });
      } else {
        this.FirebaseUser = null;
      }
    });
  }

  async signInWithEmail(user: Credential) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password).then(
      async (x) => {
        await x.user.getIdToken().then((k) => {
          this.setUser(x.user, x.additionalUserInfo.providerId, k, x.user.refreshToken);
        });

        return this.FirebaseUser;
      },
      (error) => {
        return false;
      }
    );
  }

  async signUpWithEmail(user: Credential) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password).then(
      async (x) => {
        await x.user.updateProfile({ displayName: `${user.firstName} ${user.lastName}` });
        await this.signInWithEmail(user);
        return true;
      },
      (error) => {
        return false;
      }
    );
  }

  async logOut() {
    return this.auth.signOut().then(
      async (x) => {
        localStorage.clear();
        this.storage.clear();
        window.dispatchEvent(new CustomEvent("user:loggedOut"));
        this.router.navigate(["index"]);
        return true;
      },
      (error) => {
        return false;
      }
    );
  }

  get FirebaseUser(): FirebaseUser {
    const user = localStorage.getItem("FirebaseUser");
    if (user != null) {
      return JSON.parse(user) as FirebaseUser;
    }
    return null;
  }

  set FirebaseUser(value: FirebaseUser) {
    if (value == null) {
      localStorage.removeItem("FirebaseUser");
    }
    localStorage.setItem("FirebaseUser", JSON.stringify(value));
  }

  signInGoogle() {
    return this.providerAuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  signInFacebook() {
    return this.providerAuthLogin(new firebase.auth.FacebookAuthProvider());
  }

  signInApple() {
    return this.appleSignIn
      .signin({
        requestedScopes: [ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName, ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail],
      })
      .then(
        async (res: AppleSignInResponse) => {
          const credential = new firebase.auth.OAuthProvider("apple.com").credential(res.identityToken);
          return await this.auth.signInWithCredential(credential).then(
            async (x) => {
              await x.user.getIdToken().then((k) => {
                this.setUser(x.user, x.additionalUserInfo.providerId, k, x.user.refreshToken);
              });

              return this.FirebaseUser;
            },
            (error) => {
              return false;
            }
          );
        },
        (error) => {
          return false;
        }
      );
  }

  providerAuthLogin(provider) {
    if (this.platform.is("ios") || this.platform.is("ipad") || this.platform.is("iphone")) {
      console.log("IOS google sign in");
      return this.googlePlus.login({ webClientId: "885892578415-3gkmdotl7gt6vbqru06njfmpo6j2d3q2.apps.googleusercontent.com" }).then(
        async (res) => {
          let userInfo: any = {};
          userInfo.displayName = res.displayName;
          userInfo.email = res.email;
          userInfo.emailVerified = false;
          userInfo.photoURL = res.imageUrl;
          userInfo.uid = res.userId;

          this.setUser(userInfo, "Google", res.idToken, res.refreshToken);

          return this.FirebaseUser;
        },
        async (error) => {
          console.log(JSON.stringify(error));
          return false;
        }
      );
    }

    return this.auth
      .signInWithPopup(provider)
      .then(async (result) => {
        console.log(result);
        await result.user.getIdToken().then((k) => {
          this.setUser(result.user, result.credential.providerId, k, result.user.refreshToken);
        });

        //this.redirectToDashboard();

        return this.FirebaseUser;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  setUser(userInfo, provider: string, token: string = null, refreshToken: string = null) {
    console.log("UserInfo", JSON.stringify(userInfo));
    console.log("Provider", provider);
    console.log("token", token);
    console.log("refreshTokem", refreshToken);

    const user = new FirebaseUser();
    user.displayName = userInfo.displayName;
    user.email = userInfo.email;
    user.emailVerified = userInfo.emailVerified;
    user.photoUrl = userInfo.photoURL;
    user.uid = userInfo.uid;
    user.provider = provider;
    user.token = token;
    user.refreshToken = refreshToken;

    this.FirebaseUser = user;

    this.setTokens(user);

    window.dispatchEvent(new CustomEvent("user:loggedIn"));
    console.log("i did set user");
    return user;
  }

  redirectToDashboard() {
    this.ngZone.run(() => {
      this.router.navigate(["dashboard"]);
    });
  }

  setTokens(user: FirebaseUser) {
    const myAuthToken: IAuthTokenDto = {};
    myAuthToken.Access_token = user.token;
    myAuthToken.Expires = Date.now() + 9548798453100;
    myAuthToken.Expires_in = 9086400;
    this.AuthToken = myAuthToken;
    const idToken: IdTokenDto = {};
    idToken.name = user.displayName;
    idToken.email = user.email;
    idToken.sub = user.provider;
    this.IdToken = idToken;
  }

  // IdToken
  get IdToken(): IdTokenDto {
    let a: IdTokenDto = JSON.parse(localStorage.getItem("IdToken"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set IdToken(value: IdTokenDto) {
    localStorage.setItem("IdToken", JSON.stringify(value));
  }

  // AuthToken
  get AuthToken(): IAuthTokenDto {
    let a: IAuthTokenDto = JSON.parse(localStorage.getItem("AuthToken"));
    if (a == undefined || a == null) {
      return null;
    }
    return a;
  }
  set AuthToken(value: IAuthTokenDto) {
    localStorage.setItem("AuthToken", JSON.stringify(value));
  }
}
