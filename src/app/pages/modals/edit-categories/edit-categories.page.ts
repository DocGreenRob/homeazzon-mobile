import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, ModalController } from "@ionic/angular";
import { BasePage } from "src/app/pages/base/base.page";
import { ISuite16CategoryLineitemDto } from "src/app/models/dto/interfaces/ISuite16CategoryLineitemDto";
import { ILineitemDto } from "src/app/models/dto/interfaces/ILineItemDto";
import { IUserLineitemDto } from "src/app/models/dto/interfaces/IUserLineitemDto";
import { LineitemService } from "src/app/services/lineitem/lineitem.service";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
@Component({
  selector: "app-edit-categories",
  templateUrl: "./edit-categories.page.html",
  styleUrls: ["./edit-categories.page.scss"],
})
export class EditCategoriesPage extends BasePage {
  public suite16CategoriesAndLineitems: Array<ISuite16CategoryLineitemDto>;
  public userLineitems: Array<IUserLineitemDto>;
  public didPressSave: boolean = false;

  constructor(
    public navCtrl: NavController,
    public override navParams: NavParams,
    public lineItemService: LineitemService,
    public viewCtrl: ModalController,
    public override inAppBrowser: InAppBrowser
  ) {
    super(navCtrl, navParams, null, null, null, null, null, null, null, inAppBrowser);
  }

  override ngOnInit() {
    console.log("ngOnInit  EditCategoriesPage");
    this.suite16CategoriesAndLineitems = this.Suite16CategoryLineitems;
    this.userLineitems = new Array<IUserLineitemDto>();
  }
  // TempActiveItem.Image
  public toggleCheck(event, suite16CategoryId, lineitem: ILineitemDto) {
    let isChecked: string = event.target.checked;
    let newValue: string = (!isChecked).toString(); //== 'true' ? 'false' : 'true';

    //let suite16CategoryLineitem: ISuite16CategoryLineitemDto = this.suite16CategoriesAndLineitems.filter(x => x.Id == suite16CategoryId)[0];
    //let lineitem: ILineitemDto = suite16CategoryLineitem.Lineitems.filter(x => x.Id == lineitemId)[0];

    //lineitem.IsChecked = newValue == 'true' ? true : false;

    let userLineitem: IUserLineitemDto = {
      Id: 0,
      IsDisplay: !isChecked,
      LineitemId: lineitem.Id,
      ProfileItemId: this.ProfileItem.Id,
    };

    let a = this.userLineitems.filter((x) => x.LineitemId == lineitem.Id);

    if (a.length == 0) {
      this.userLineitems.push(userLineitem);
    } else {
      // remove from array
      let tempUserLineitems = this.userLineitems.filter((x) => x.LineitemId != lineitem.Id);

      // then add new value to array
      tempUserLineitems.push(userLineitem);
      this.userLineitems = tempUserLineitems;
    }
  }

  public async save() {
    this.didPressSave = true;
    this.userLineitems.forEach(async (x) => {
      await this.lineItemService.saveUserLineitem(x);
    });

    this.cancel();
  }

  public cancel() {
    this.userLineitems = [];
    this.viewCtrl.dismiss({ isRefresh: this.didPressSave });
  }
}
