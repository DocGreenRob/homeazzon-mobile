import { Component } from "@angular/core";
import { BasePage } from "src/app/pages/base/base.page";
import { NavController, Platform } from "@ionic/angular";
import { UxNotifierService } from "src/app/services/uxNotifier/ux-notifier.service";
import { Router } from "@angular/router";
import { LocalStorageService } from "@app/services/local-storage.service";
import { Location } from "@angular/common";
@Component({
  selector: "repair-list",
  templateUrl: "./repair-list.page.html",
  styleUrls: ["./repair-list.page.scss"],
})
export class RepairListComponent extends BasePage {

   repairItemList = [
    {
      image: 'assets/icon/bed-svgrepo-com 1.svg',
      name: 'Bathroom shower issue',
      date: '11-2-24'
    },
    {
      image: 'assets/icon/bed-svgrepo-com 1.svg',
      name: 'Bathroom shower issue',
      date: '11-2-24'
    },
    {
      image: 'assets/icon/bed-svgrepo-com 1.svg',
      name: 'Bathroom shower issue',
      date: '11-2-24'
    },
    {
      image: 'assets/icon/bed-svgrepo-com 1.svg',
      name: 'Bathroom shower issue',
      date: '11-2-24'
    }
   ];
    
  constructor(
    public override navController: NavController,
    public override uxNotifierService: UxNotifierService,
    public override platform: Platform,
    public override router: Router,
    public override storageService: LocalStorageService,
    private location: Location,
  ) {
    super(navController, null, null, null, platform, router, uxNotifierService, null, null, null, storageService);
  
    }
    editRepairItem(){
      this.router.navigate(['repair']);
    }

    public close() {
      this.location.back();
    }
}
