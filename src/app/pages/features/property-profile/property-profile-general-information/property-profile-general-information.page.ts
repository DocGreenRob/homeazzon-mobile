import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { LoadingController, NavController, Platform } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { BasePage } from "src/app/pages/base/base.page";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { PropertyService } from "../../../../services/property/property.service";

@Component({
  selector: "app-property-profile-general-information",
  templateUrl: "./property-profile-general-information.page.html",
  styleUrls: ["./property-profile-general-information.page.scss"],
})
export class PropertyProfileGeneralInformationPage extends BasePage {
  public property: IPropertyDto;
  public isDefault: boolean = false;
  public isEditingProperty: boolean = false;
  public isOwner: boolean = false;
  public isRealtor: boolean = false;
  public title: string = 'Let’s start with some general information';
  public isLinkWithCustomer: boolean = false;
  public isExistingLinkWithCustomer: boolean = false;
  public customerName: string = '';
  public customerEmail: string = '';
  public isIos: boolean = false;

  private _constants = new Constants();
  private _loading: any;
  private _selectedProperty: any;
  spinnerText: string = 'Loading...';
  loading1Visible: boolean = false;
  spinnerText2: string = 'Loading...';
  loading2Visible: boolean = false;

  constructor(public navCtrl: NavController,
    public override platform: Platform,
    public override router: Router,
    public override uxNotifierService: UxNotifierService,
    public override storageService: LocalStorageService,
    private propertyService: PropertyService,
    public loadingController: LoadingController) {
    super(navCtrl, null, null, null, platform, router, uxNotifierService, null, null, null, storageService);
    this._constants = new Constants();

    this.property = {} as IPropertyDto;
    this.property.SqFt = null;

    this.isIos = this.platform.is('ios');
  }

  override async ngOnInit() {
    console.log("ngOnInit PropertyProfileGeneralInformationPage");
    //this.AppInsights.trackPageView({ name: 'PropertyProfileGeneralInformationPage' });

  }

  override async ionViewDidLoad() {

  }

  async ionViewWillEnter() {
    await this.start();
  }

  async start() {
    this._selectedProperty = this.SelectedProperty;

    this.isEditingProperty = this.IsEditingProperty ?? false; // await this.storageService.get("IsEditingProperty");

    if (this.isEditingProperty) {
      this._selectedProperty = this.SelectedProperty;

      this.property.Name = this._selectedProperty.Name;
      this.property.SqFt = this._selectedProperty.SqFt;
      this.property.TotalStories = this._selectedProperty.TotalStories;
      this.isDefault = this._selectedProperty.IsDefault;

      if (this.NewSelectedUserType.Name.toLowerCase().indexOf('owner') > -1) {
        this.title = 'Property general information';
        this.isOwner = true;
      }

      if (this.NewSelectedUserType.Name.toLowerCase().indexOf('realtor') > -1) {
        this.title = 'Property general information';
        this.isRealtor = true;

        if (this._selectedProperty.Customer != null) {
          this.isExistingLinkWithCustomer = true;
          this.isLinkWithCustomer = true;
          this.customerName = this._selectedProperty.Customer.Name;
          this.customerEmail = this._selectedProperty.Customer.Email;
        }
      }

    }
  }

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
  async goToBedroomsPage() {
    if (this.property.TotalStories === undefined || this.property.TotalStories === 0) {
      this.uxNotifierService.showToast("Total stories must be greater than 0", this._constants.ToastColorBad);
      return;
    }

    if (this.property.SqFt === undefined || this.property.SqFt === 0) {
      this.uxNotifierService.showToast("Sq Ft must be greater than 0", this._constants.ToastColorBad);
      return;
    }

    if (this.property.Name === undefined || this.property.Name === "") {
      this.uxNotifierService.showToast("Please enter a name", this._constants.ToastColorBad);
      return;
    }

    // TODO: Need to refactor the property to have the structure of IPropertyDto
    /*
    let customProperty: IPropertyDto = this.CustomProperty;

    if (customProperty == null) {
      customProperty = {} as IPropertyDto;
    }
    */

    let customProperty: any = this.CustomProperty;

    const { TotalStories, SqFt, Name } = this.property;

    if (this.isEditingProperty) {
      // TODO: Need to refactor the property to have the structure of IPropertyDto
      // save property address information
      let p: any = this._selectedProperty;
      p.Id = this._selectedProperty.Id;
      p.IsPublicProperty = this._selectedProperty.IsPublicProperty;
      p.Name = Name;
      p.SqFt = SqFt;
      p.TotalStories = TotalStories;
      p.IsDefault = this.isDefault;
      p.Address = {};
      p.Address.StreetAddress1 = customProperty.Address.StreetAddress1;
      p.Address.StreetAddress2 = customProperty.Address.StreetAddress2;
      p.Address.City = customProperty.Address.City;
      p.Address.State = customProperty.Address.State;
      p.Address.StateCode = customProperty.Address.StateCode === '' ? customProperty.Address.State : customProperty.Address.StateCode;
      p.Address.Zip = customProperty.Address.Zip;
      p.Address.Country = customProperty.Address.Country;
      p.Address.CountryCode = customProperty.Address.CountryCode === '' ? customProperty.Address.Country : customProperty.Address.CountryCode;

      this.presentSpinnerAddress('Updating Address...');
      await this.propertyService.updateAddress(p).then(async (x) => {

        // update the property with the new address
        let a = this.Properties;
        let modifiedProperty = a.filter((x) => x.Id == p.Id)[0];

        // remove the old property
        let newPropertiesList = a.filter((x) => x.Id != p.Id);

        modifiedProperty.StreetAddress1 = customProperty.Address.StreetAddress1;
        modifiedProperty.State = p.Address.State;
        modifiedProperty.City = p.Address.City;
        modifiedProperty.SqFt = p.SqFt;
        modifiedProperty.TotalStories = p.TotalStories;
        modifiedProperty.Name = p.Name;

        newPropertiesList.push(modifiedProperty);

        this.Properties = newPropertiesList;

        // if (1 === 1) {
        if (this.isLinkWithCustomer && !this.isExistingLinkWithCustomer) {
          this.uxNotifierService.showToast('Customer address updated', this._constants.ToastColorGood);


          this.dismissSpinnerAddress();

          this.presentSpinnerLinking('Linking with Customer...');

          p.Customer = {
            Name: this.customerName,
            Email: this.customerEmail
          };

          await this.propertyService.updatePropertyCustomerInformationToMakeSuggestions(p).then((x) => {

            this.dismissSpinnerLinking();
            this.finish("Customer link succeeded! (Request pending)");
          }).catch((err) => {
            this.uxNotifierService.showToast("Customer link failed!", this._constants.ToastColorBad);
          });
        } else {

          this.dismissSpinnerAddress();
          this.finish("Address updated.");
        }

      }).catch((err) => {
        this.uxNotifierService.showToast("Address was not updated!", this._constants.ToastColorBad);
      });
    } else {
      let customProperty: IPropertyDto = this.CustomProperty;

      if (customProperty == null) {
        customProperty = {} as IPropertyDto;
      }

      customProperty.Name = Name;
      customProperty.SqFt = SqFt;
      customProperty.TotalStories = TotalStories;
      this.CustomProperty = customProperty;
      this.viewProperty(customProperty);

      this.router.navigate(["property-profile-bedrooms"]);
    }
  }

  async viewProperty(p: IPropertyDto) {
    this.storageService.set('ActiveProperty', p);
  }

  public selectInput2(event) {
    debugger;
    event.target.select();
  }

  private finish(message: string) {
    this.isExistingLinkWithCustomer = false;
    this.isLinkWithCustomer = false;
    this.isEditingProperty = false;

    this.uxNotifierService.showToast(message, this._constants.ToastColorGood);

    this.SelectedProperty = null;

    this.router.navigate(["dashboard"]);
  }

  public close() {
    this.navCtrl.pop();
  }

  goBack() {
    this.navController.back();
  }


  async presentSpinnerAddress(text: string) {
    this.spinnerText = text;
    this.loading1Visible = true;
  }

  async dismissSpinnerAddress() {
    this.loading1Visible = false;
    this.spinnerText = '';
  }


  async presentSpinnerLinking(text: string) {
    this.spinnerText2 = text;
    this.loading2Visible = true;
  }

  async dismissSpinnerLinking() {
    this.loading2Visible = false;
    this.spinnerText2 = '';
  }

}
