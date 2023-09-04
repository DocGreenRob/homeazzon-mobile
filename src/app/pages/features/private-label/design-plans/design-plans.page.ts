import { Component } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Constants } from "src/app/common/Constants";
import { IDesignPanDto } from "src/app/models/dto/interfaces/IDesignPlanDto";
import { BasePage } from "src/app/pages/base/base.page";
import { PrivateLabelService } from "src/app/services/private-label/private-label.service";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";

@Component({
  selector: "app-design-plans",
  templateUrl: "./design-plans.page.html",
  styleUrls: ["./design-plans.page.scss"],
})
export class DesignPlansPage extends BasePage {
  propertyId: number;
  propertyName: string;
  designPlans: Array<any> = new Array();
  activePage: number;
  constants: Constants = new Constants();

  constructor(
    public navCtrl: NavController,
    private notificationProvider: UxNotifierService,
    public override router: Router,
    private activeRoute: ActivatedRoute,
    private privateLabelService: PrivateLabelService
  ) {
    super(null, null, null, null, null, router, null, null, null);
  }
  override ngOnInit() {
    console.log("ngOnInit DesignPlansPage");
    //this.AppInsights.trackPageView({ name: 'DesignPlansPage' });

    this.activeRoute.queryParams.subscribe((params) => {
      console.log("ionViewDidLoad DesignPlansPage");
      this.propertyName = params["Name"];
      this.propertyId = params["Id"];
      this.getDesignPlans();
    });
  }

  getPropertyName() {
    return this.propertyName;
  }
  getDesignPlans() {
    this.privateLabelService.getDesignPlans(this.propertyId).then(
      (response: Array<IDesignPanDto>) => {
        this.designPlans = response.map((x: any) => {
          x.totalPages = 0;
          x.zoom = 0;
          x.activePage = 1;
          return x;
        });
      },
      (error) => {
        this.notificationProvider.showToast("An error occured  while getting plans.Please try again later", this.constants.ToastColorBad);
      }
    );
  }

  afterLoadComplete($event: any, plan) {
    let index = this.designPlans.indexOf(plan);
    this.designPlans[index].totalPages = $event.numPages;
  }

  previousPage(plan) {
    let index = this.designPlans.indexOf(plan);
    let activePage = this.designPlans[index].activePage;
    if (activePage == 1) {
    } else {
      this.designPlans[index].activePage = this.designPlans[index].activePage - 1;
    }
  }

  nextPage(plan) {
    let index = this.designPlans.indexOf(plan);
    let activePage = this.designPlans[index].activePage;
    if (activePage == this.designPlans[index].totalPages) {
    } else {
      this.designPlans[index].activePage = this.designPlans[index].activePage + 1;
    }
  }

  zoomReduce(plan) {
    let index = this.designPlans.indexOf(plan);
    this.designPlans[index].zoom = this.designPlans[index].zoom - 1;
  }

  zoomIncrease(plan) {
    let index = this.designPlans.indexOf(plan);
    this.designPlans[index].zoom = this.designPlans[index].zoom + 1;
  }

  close() {
    this.navCtrl.pop();
  }

  viewFullDesign(plan) {
    let navExtras: NavigationExtras = {
      queryParams: { title: plan.Title, pdfUrl: plan.PdfUrl },
    };
    this.router.navigate(["single-design-plan"], navExtras);
  }
}
