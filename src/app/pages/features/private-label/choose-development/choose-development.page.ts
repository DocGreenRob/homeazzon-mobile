import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { IDevelopmentDto } from "src/app/models/dto/interfaces/IDevelopmentDto";
import { ILotDto } from "src/app/models/dto/interfaces/ILotDto";
import { IPropertyDto } from "src/app/models/dto/interfaces/IPropertyDto";
import { IStateDto } from "src/app/models/dto/interfaces/IStateDto";
import { IUserDto } from "src/app/models/dto/interfaces/IUserDto";
import { BasePage } from "src/app/pages/base/base.page";
import { PrivateLabelService } from "src/app/services/private-label/private-label.service";
import { UtilitiesService } from "src/app/services/utlities/utilities.service";
import { LotDetailsPage } from "../lot-details/lot-details.page";
@Component({
  selector: "app-choose-development",
  templateUrl: "./choose-development.page.html",
  styleUrls: ["./choose-development.page.scss"],
})
export class ChooseDevelopmentPage extends BasePage {
  private propertyId: any;
  public isPrivateLabelBuildYourOwn: boolean = false;
  privateLabelId: any;
  public developments: Array<IDevelopmentDto>;
  public lots: Array<ILotDto>;
  public showDevelopments: boolean;
  public showLots: boolean;
  private states: Array<IStateDto>;
  selectedDevelopment: IDevelopmentDto = {} as IDevelopmentDto;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public override router: Router,
    private loading: UtilitiesService,
    private privatelabelService: PrivateLabelService,
    private staticDataService: UtilitiesService,
    private activeRoute: ActivatedRoute,
    private storage: Storage
  ) {
    super(navCtrl, null, null, null, null, router, null, null, null);
    this.showDevelopments = true;
    this.showLots = false;
  }

  override async ngOnInit() {
    console.log("ngOnInit ChooseDevelopmentPage");
    //this.AppInsights.trackPageView({ name: 'ChooseDevelopmentPage' });

    this.activeRoute.queryParams.subscribe((params) => {
      this.propertyId = params["Id"];
      this.privateLabelId = params["privateLabelId"];
      this.isPrivateLabelBuildYourOwn = params["isPrivateLabelBuildYourOwn"];
      console.log(this.propertyId, this.privateLabelId);
      this.getDevelopments();
      this.staticDataService.getStates().then(
        (x: Array<IStateDto>) => {
          this.states = x;
        },
        (err) => {}
      );
    });

    // get the states so that we can traslate the UI and show the
    // actual state based on the Id.
    // TODO: Change this and add this logic to the Api
  }

  async getDevelopments() {
    let loader = await this.loading.getLoader("getting property developments...");
    await loader.present();
    let user: IUserDto = JSON.parse(localStorage.getItem("User"));
    //await this.privatelabelService.getPrivateLabelerDevelopments(user.PrivateLabeler.Id)
    await this.privatelabelService.getPrivateLabelerDevelopments(0).then(
      (x: Array<IDevelopmentDto>) => {
        debugger;
        this.developments = x;
        loader.dismiss();
      },
      (error) => {
        loader.dismiss();
        console.log(error);
      }
    );
  }

  async peekLots(development: IDevelopmentDto) {
    this.showDevelopments = false;
    this.showLots = true;
    this.selectedDevelopment = development;
    let loader = await this.loading.getLoader("getting development lots ...");
    await loader.present();

    if (this.isPrivateLabelBuildYourOwn) {
      this.storage.get("CustomProperty").then(
        (x: IPropertyDto) => {
          x.Developments = new Array<IDevelopmentDto>();
          x.Developments.push(development);
          this.storage.set("CustomProperty", x);
        },
        (err) => {}
      );
    }

    await this.privatelabelService.peekDevelopmentLots(development.Id).then(
      (x: Array<ILotDto>) => {
        x.forEach((a) => {
          let stateId: number = parseInt(a.State);
          a.State = this.states.filter((b) => b.Id == stateId)[0].Abbv;
        });

        this.lots = x;

        loader.dismiss();
      },
      (error) => {
        loader.dismiss();
        console.log(error);
      }
    );
  }

  async viewLotDetails(lotId: number) {
    //	this.navCtrl.push(LotDetailsPage, { Id: lotId, isPrivateLabelBuildYourOwn: this.isPrivateLabelBuildYourOwn, imageUrl: this.selectedDevelopment.Url });
    let lotDetailsModal = await this.modalCtrl.create({
      component: LotDetailsPage,
      componentProps: { Id: lotId, isPrivateLabelBuildYourOwn: this.isPrivateLabelBuildYourOwn, imageUrl: this.selectedDevelopment.Url },
      cssClass: "large-modal",
    });
    await lotDetailsModal.present();
  }

  public close() {
    this.navCtrl.pop();
  }
}
