import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController, NavController } from "@ionic/angular";
import { Credential } from "src/app/models/Credential";
import { FirebaseAuthService } from "src/app/services/FirebaseAuth/firebase-auth.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { IUserDto } from "../../../../models/dto/interfaces/IUserDto";
import { AccountService } from "../../../../services/account/account.service";
import { BasePage } from "../../../base/base.page";
import { FirebaseUser } from "src/app/models/FirebaseUser";
import { LocalStorageService } from "@app/services/local-storage.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.page.html",
  styleUrls: ["./sign-up.page.scss"],
})
export class SignUpPage extends BasePage {
  spinnerText: string = 'Loading...';
  loading1Visible: boolean = false;

  signUpForm = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    cpassword: new FormControl("", [Validators.required]),
    firstName: new FormControl("", [Validators.required]),
    lastName: new FormControl("", [Validators.required]),
  });

  _loading: any;

  constructor(
    private auth: FirebaseAuthService,
    public override router: Router,
    public navCtrl: NavController,
    public uxNotifier: UxNotifierService,
    private accountService: AccountService,
    private loadingCtrl: LoadingController,
    private alert: AlertController,
    public override storageService: LocalStorageService
  ) {
    super(navCtrl, null, null, null, null, router, uxNotifier, null, null, null,storageService);
  }

  override ngOnInit() {}

  async signUp() {
    if (this.signUpForm.valid && this.signUpForm.value.password == this.signUpForm.value.cpassword) {
      let user = new Credential();
      user.email = this.signUpForm.value.email;
      user.password = this.signUpForm.value.password;
      user.firstName = this.signUpForm.value.firstName;
      user.lastName = this.signUpForm.value.lastName;


      this.presentSpinner('Registering...');

      await this.auth.signUpWithEmail(user).then(async (x) => {
        if (x) {
          await this.getUser();

          this.dismissSpinner();
          this.router.navigate(["dashboard"]);
        } else {
          this.uxNotifier.showToast("Error creating your account", "danger");
        }
      });
    } else {
      this.uxNotifier.showToast("Fill all the fields to continue", "danger");
    }
  }

  async signInApple() {
    this.auth
      .signInApple()
      .then(async (a: any) => {
        this.AppInsights.trackEvent({
          name: "SignInPage.signInApple().then()",
          properties: [{}],
        });
        if (a) {
          await this.getUser();
          this.dismissSpinner();
          this.router.navigate(["dashboard"]);
        } else {
          this.uxNotifier.showToast("Error occured while signing with apple.", "danger");
        }
      })
      .catch((err) => {});
  }

  async signInGoogle() {
    this.auth.signInGoogle();
  }

  async signIn() {
    this.navCtrl.navigateForward(["sign-in"]);
  }

  async signInFb() {
    this.auth.signInFacebook();
  }

  private async getUser() {
    await this.accountService.getUser().then(async (x: IUserDto) => {
      if (x === undefined || x === null) {
        const user: any = {
          Email: this.auth.FirebaseUser.email,
          Types: [{ Id: 0, IsActive: null, Name: "Owner" }], //TODO: need to not default to owner, maybe here need to ask user for their type
          // and then go into other registration screens (give option to save for later)
          FullName: this.auth.FirebaseUser.displayName,
          Provider: this.auth.FirebaseUser.provider,
          ProviderUniqueId: this.auth.FirebaseUser.uid,
        };

        await this.accountService
          .signUp(user)
          .then(async (x) => {
            await this.getUser();
          })
          .catch((e) => {});
      } else {
        this.User = x;
      }
    });
  }
  
  async presentSpinner(text: string) {
    this.spinnerText = text;
    this.loading1Visible = true;
  }

  async dismissSpinner() {
    this.loading1Visible = false;
    this.spinnerText = ''; 
  }
}
