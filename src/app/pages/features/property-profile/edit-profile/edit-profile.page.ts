import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AlertController, LoadingController, MenuController, ModalController, NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Constants } from "src/app/common/Constants";
import { BasePage } from "src/app/pages/base/base.page";
import { AddRoomModalPage } from "src/app/pages/modals/add-room-modal/add-room-modal.page";
import { PropertyProfilesService } from "src/app/services/property-profile/property-profiles.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.page.html",
  styleUrls: ["./edit-profile.page.scss"],
})
export class EditProfilePage extends BasePage {
  // Private
  private loading: any;

  // Public
  public profileAreaType: string = "";
  public isEditable: boolean = false;
  doading: any;

  property: any;
  profileName: any;
  exteriors: any;
  testRadioOpen: boolean;
  testRadioResult;

  commonAreas: any;
  bedroomAreas: any;
  bathroomAreas: any;
  exteriorAreas: any;

  public activeRooms: any = [];
  public activePropertyBedrooms: any = [];
  public activePropertyBathrooms: any = [];
  public activePropertyCommonAreas: any = [];
  public activePropertyExteriorAreas: any = [];

  userName: string;
  constants: Constants;
  expectedSuccessCalls: number = 0;
  timesSuccessCalled: number = 0;
  isPrivateLabelerUser: boolean = false;

  public roomType: string = "";

  constructor(
    public navCtrl: NavController,
    private propertyProfile: PropertyProfilesService,
    private loadingProvider: UtilitiesService,
    private loadingCtrl: LoadingController,
    public toast: UxNotifierService,
    private modalCtrl: ModalController,
    private storage: Storage,
    public override platform: Platform,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    public override menuController: MenuController,
    private alertCtrl: AlertController
  ) {
    super(navCtrl, null, null, menuController, platform, router, toast, null, null);
    this.constants = new Constants();
  }

  override async ngOnInit() {
    console.log("ngOnInit EditProfilePage");
    //this.AppInsights.trackPageView({ name: 'EditProfilePage' });

    this.profileName = this.QueryParams.profileName;
    let areaType = this.QueryParams.areaType;
    let isAddExterior = this.QueryParams.isAddExterior;

    console.log("profileAreaType", this.profileAreaType);

    if (this.profileName === "bedroom") {
      this.roomType = "Bedroom";
      this.getBedRoomAreas();
    } else if (this.profileName === "bathroom") {
      this.roomType = "Bathroom";
      this.getBathroomAreas();
    } else if (this.profileName === "commonarea") {
      this.roomType = "Common Area";
      this.getCommonAreas();
    } else if (this.profileName === "exterior") {
      this.roomType = "Exterior Area";
      this.getExteriorAreas();
    }

    this.isPrivateLabelerUser = this.User.IsPrivateLabelUser;

    if ((this.User.IsPrivateLabelUser == true && this.ActiveProperty.IsProxy == false) || this.User.IsPrivateLabelUser == false) {
      this.isEditable = true;
    }
  }

  async getBedRoomAreas() {
    this.propertyProfile.getAreaTypes("bedroom").then((response) => {
      this.bedroomAreas = response;

      this.ActiveProperty.Profiles.forEach((x) => {
        this.bedroomAreas.forEach((y) => {
          if (x.Area.Id === y.Id) {
            x.ProfileItems.forEach((z) => {
              this.activePropertyBedrooms.push({
                Id: z.Id,
                Name: z.Name,
                SqFt: z.SqFt,
              });
            });
          }
        });
      });

      this.activeRooms = this.activePropertyBedrooms;
    });
  }

  async getBathroomAreas() {
    this.propertyProfile.getAreaTypes("bathroom").then((response) => {
      this.bathroomAreas = response;

      this.ActiveProperty.Profiles.forEach((x) => {
        this.bathroomAreas.forEach((y) => {
          if (x.Area.Id === y.Id) {
            x.ProfileItems.forEach((z) => {
              this.activePropertyBathrooms.push({
                Id: z.Id,
                Name: z.Name,
                SqFt: z.SqFt,
              });
            });
          }
        });
      });

      this.activeRooms = this.activePropertyBathrooms;
    });
  }

  async getCommonAreas() {
    this.propertyProfile.getAreaTypes("interior").then((response: any) => {
      this.commonAreas = response;

      this.ActiveProperty.Profiles.forEach((x) => {
        this.commonAreas.forEach((y) => {
          if (x.Area.Id === y.Id) {
            x.ProfileItems.forEach((z) => {
              this.activePropertyCommonAreas.push({
                Id: z.Id,
                Name: z.Name,
                SqFt: z.SqFt,
              });
            });
          }
        });
      });

      this.activeRooms = this.activePropertyCommonAreas;
    });
  }

  async getExteriorAreas() {
    this.propertyProfile.getAreaTypes("exterior").then((response) => {
      this.exteriorAreas = response;

      this.ActiveProperty.Profiles.forEach((x) => {
        this.exteriorAreas.forEach((y) => {
          if (x.Area.Id === y.Id) {
            x.ProfileItems.forEach((z) => {
              this.activePropertyExteriorAreas.push({
                Id: z.Id,
                Name: z.Name,
                SqFt: z.SqFt,
              });
            });
          }
        });
      });

      this.activeRooms = this.activePropertyExteriorAreas;
    });
  }

  public async addRoom() {
    let areas: any = [];

    if (this.profileName === "bedroom") {
      areas = this.bedroomAreas;
    } else if (this.profileName === "bathroom") {
      areas = this.bathroomAreas;
    } else if (this.profileName === "commonarea") {
      areas = this.commonAreas;
    } else if (this.profileName === "exterior") {
      areas = this.exteriorAreas;
    }

    let addRoomModal = await this.modalCtrl.create({
      component: AddRoomModalPage,
      componentProps: { areas: areas, areaTypeName: `${this.roomType}s`, UiType: "x" },
      cssClass: "small-modal",
    });
    await addRoomModal.present();
    await addRoomModal.onDidDismiss().then((data: any) => {
      if (data.data != null && data.data != undefined) {
        this.activeRooms.push({
          Id: data.data.Id,
          Name: data.data.name,
          Quantity: 1,
          SqFt: data.data.sqFt,
          Property: this.ActiveProperty,
          Area: data.data.Area,
        });
      }
    });

    if (this.profileName === "bedroom") {
      this.bedroomAreas = areas;
    } else if (this.profileName === "bathroom") {
      this.bathroomAreas = areas;
    } else if (this.profileName === "commonarea") {
      this.commonAreas = areas;
    } else if (this.profileName === "exterior") {
      this.exteriorAreas = areas;
    }
  }

  public async save() {
    this.loading = await this.loadingCtrl.create({
      message: "saving...",
      cssClass: "my-loading-class",
    });
    await this.loading.present();

    let profileItems: any = [];
    this.activeRooms.forEach((x) => {
      profileItems.push({
        Id: x.Id,
        Name: x.Name,
        SqFt: x.SqFt,
        Property: x.Property ? x.Property : null,
        Area: x.Area ? x.Area : null,
      });
    });
    await this.upsertProfileItems(profileItems);
  }

  async upsertProfileItems(array: Array<any>) {
    await this.propertyProfile
      .postProfile(array, this.ProfileItem.Id, this.UserTypes)
      .then(
        () => {
          this.success();
        },
        (error) => {
          console.log(error);
          this.failure();
        }
      )
      .catch((x) => {
        this.failure();
      });
  }

  success(override: boolean = false) {
    this.loading.dismiss();
    this.toast.showToast("Property profile was updated successfully", this.constants.ToastColorGood);
    //localStorage.setItem("restart", "true");
    let navExtras: NavigationExtras = {
      queryParams: {
        refreshActiveProperty: true,
        delay: 30,
      },
    };
    this.router.navigate(["dashboard"], navExtras);
  }

  failure() {
    this.loading.dismiss();
    console.log("failure");
    this.toast.showToast("No changes were made, something went wrong!", this.constants.ToastColorBad);
    let navExtras: NavigationExtras = {
      queryParams: {
        isNotFromHomePage: true,
      },
    };
    this.router.navigate(["dashboard"], navExtras);
  }

  async deleteProfileItem(profileItemId: number) {
    console.log(profileItemId);

    this.loading = await this.loadingCtrl.create({
      message: "deleting...",
      cssClass: "my-loading-class",
    });
    await this.loading.present();

    await this.propertyProfile.deleteLineItem(profileItemId, this.UserTypes).then(
      () => {
        this.loading.dismiss();
        this.toast.showToast("Area was removed successfully", this.constants.ToastColorGood);
        let navExtras: NavigationExtras = {
          queryParams: {
            restart: true,
          },
        };
        this.router.navigate(["dashboard"], navExtras);
      },
      (error) => {
        this.loading.dismiss();
        this.toast.showToast("Something went wrong!", this.constants.ToastColorBad);
        console.log(error);
      }
    );
  }

  addProfileInterior(profileID, areaId) {
    for (let profile of this.property.Profiles) {
      if (profile.Id == profileID) {
        let sampleLineItem: any = {
          Name: "",
          SqFt: 0,
          Id: "0",
          Profile: { Id: 0 },
          ProfileItems: [],
          Property: { Id: this.property.Id },
          Area: { Id: areaId },
          QRCodeCount: 0,
          ProductCount: 0,
        };

        profile.ProfileItems.push(sampleLineItem);
        console.log(profile.ProfileItems);
      }
    }
  }

  public async addProfileItemAsync() {
    //new code
    let areaTypesList = [];
    if (this.profileName == "exterior") {
      areaTypesList = this.exteriorAreas;
    } else if (this.profileName == "bedroom") {
      areaTypesList = this.bedroomAreas;
    } else if (this.profileName == "bathroom") {
      areaTypesList = this.bathroomAreas;
    } else if (this.profileName == "commonarea") {
      areaTypesList = this.commonAreas;
    }

    const profileModal = await this.modalCtrl.create({
      component: AddRoomModalPage,
      componentProps: { areas: areaTypesList, areaTypeName: this.profileName },
      cssClass: "small-modal",
    });

    await profileModal.onDidDismiss().then((result: any) => {
      let data = result.data;
      if (data != null && data.Id && data.name && data.sqFt) {
        this.profileName = data.areaType;

        if (this.profileName == "exterior") {
          //console.log(data);

          //push the object to the profiles of the property
          //create a profile line item
          const sampleLineItem: any = {
            Name: data.name,
            SqFt: data.sqFt,
            Id: "0",
            Profile: { Id: 0 },
            ProfileItems: [],
            Property: { Id: this.property.Id },
            Area: { Id: data.Id },
            QRCodeCount: 0,
            ProductCount: 0,
          };
          //create a map object for the exteriors
          const fullProfile = {
            Area: {
              Type: {
                Name: "Exterior",
              },
            },
            ProfileItems: [sampleLineItem],
          };

          this.property.Profiles.push(fullProfile);
          console.log(this.property);
        } else if (this.profileName == "bedroom") {
          //console.log(data);

          //push the object to the profiles of the property
          //create a profile line item
          let sampleLineItem: any = {
            Name: data.name,
            SqFt: data.sqFt,
            Id: "0",
            Profile: { Id: 0 },
            ProfileItems: [],
            Property: { Id: this.property.Id },
            Area: { Id: data.Id },
            QRCodeCount: 0,
            ProductCount: 0,
          };
          //create a map object for the exteriors
          let fullProfile = {
            Area: {
              Type: {
                Name: "Interior",
              },
              Id: data.Id,
            },
            ProfileItems: [sampleLineItem],
          };
          this.property.Profiles.push(fullProfile);
        } else if (this.profileName == "bathroom") {
          //console.log(data);

          //push the object to the profiles of the property
          //create a profile line item
          let sampleLineItem: any = {
            Name: data.name,
            SqFt: data.sqFt,
            Id: "0",
            Profile: { Id: 0 },
            ProfileItems: [],
            Property: { Id: this.property.Id },
            Area: { Id: data.Id },
            QRCodeCount: 0,
            ProductCount: 0,
          };
          //create a map object for the exteriors
          let fullProfile = {
            Area: {
              Type: {
                Name: "Interior",
              },
              Id: data.Id,
            },
            ProfileItems: [sampleLineItem],
          };

          this.property.Profiles.push(fullProfile);
        } else if (this.profileName == "commonarea") {
          //console.log(data);

          //push the object to the profiles of the property
          //create a profile line item
          let sampleLineItem: any = {
            Name: data.name,
            SqFt: data.sqFt,
            Id: "0",
            Profile: { Id: 0 },
            ProfileItems: [],
            Property: { Id: this.property.Id },
            Area: { Id: data.Id },
            QRCodeCount: 0,
            ProductCount: 0,
          };
          //create a map object for the exteriors
          let fullProfile = {
            Area: {
              Type: {
                Name: "Interior",
              },
              Id: data.Id,
            },
            ProfileItems: [sampleLineItem],
          };

          this.property.Profiles.push(fullProfile);
        }
      }
    });
    profileModal.present();
  }

  public close() {
    this.navCtrl.pop();
  }
}
