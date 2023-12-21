import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { BasePage } from "src/app/pages/base/base.page";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-property-profile-general-information",
  templateUrl: "./property-profile-general-information.page.html",
  styleUrls: ["./property-profile-general-information.page.scss"],
})
export class PropertyProfileGeneralInformationPage extends BasePage {
  public property: IPropertyDto;
  constants = new Constants();

  constructor(public navCtrl: NavController, public override platform: Platform, public override router: Router, private toast: UxNotifierService, public override storageService: LocalStorageService
    ) {
    super(navCtrl, null, null, null, platform, router, null, null, null,null,storageService);
    this.constants = new Constants();

    this.property = {} as IPropertyDto;
    this.property.SqFt = null;
  }
  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileGeneralInformationPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileGeneralInformationPage' });
  }

  override ionViewDidLoad() { }

  //increment the quantity
  increment() {
    if (this.property.TotalStories === undefined || this.property.TotalStories === 0) {
      this.property.TotalStories = 1;
    } else {
      this.property.TotalStories += 1;
    }
  }

  //decrement the quantity
  decrement() {
    if (this.property.TotalStories === undefined || this.property.TotalStories === 0) {
      this.property.TotalStories = 0;
    } else {
      this.property.TotalStories -= 1;
    }
  }

  //navigate to ProfileBedrooms page
  goToBedroomsPage() {
    if (this.property.TotalStories === undefined || this.property.TotalStories === 0) {
      this.toast.showToast("Total stories must be greater than 0", this.constants.ToastColorBad);
      return;
    }

    if (this.property.SqFt === undefined || this.property.SqFt === 0) {
      this.toast.showToast("Sq Ft must be greater than 0", this.constants.ToastColorBad);
      return;
    }

    if (this.property.Name === undefined || this.property.Name === "") {
      this.toast.showToast("Please enter a name", this.constants.ToastColorBad);
      return;
    }
    
    if (this.CustomProperty == null) {
      this.CustomProperty = {} as IPropertyDto;
    }

    const {TotalStories, SqFt, Name} = this.property;

    this.CustomProperty = { TotalStories, SqFt, Name, ...this.CustomProperty};

    this.router.navigate(["property-profile-bedrooms"]);
  }

  public close() {
    this.navCtrl.pop();
  }

  goBack() {
    this.navController.back();
  }

  public clearIfZero(item) {
    if (item.TotalStories == undefined || item.TotalStories == null || item.TotalStories == 0) {
      item.TotalStories = '';
    }
  }
}
