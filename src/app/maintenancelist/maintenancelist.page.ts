import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '@app/services/local-storage.service';
import { IonModal, ModalController } from '@ionic/angular';
import { differenceInWeeks, differenceInMonths } from 'date-fns';
// maintenance.model.ts
export interface MaintenanceItem {
  id: number
  date_time: string;
  maintenancePerson: string;
  notes: string;
  flowup: {
    date: string;
    weeks: number;
    months: number;
  };
}
@Component({
  selector: 'app-maintenancelist',
  templateUrl: './maintenancelist.page.html',
  styleUrls: ['./maintenancelist.page.scss'],
})
export class MaintenancelistPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  selectedDate: string;
  showMonthsWeeks: boolean;
  weeksAway: number;
  monthsAway: number;
  selectedDatetime: string;
  maintenancePerson: string;
  notes: string;
  maintenanceList: MaintenanceItem[] = [];

  constructor(
    private modalController: ModalController,
    private storageService: LocalStorageService,
    public router: Router
  ) { }

  loadMaintenanceList() {
    const storedMaintenanceList = this.storageService.get('maintenanceList');
    if (storedMaintenanceList) {
      this.maintenanceList = storedMaintenanceList;
    }
  }
  public close() {
      this.router.navigate(["dashboard"]);
  }
  calculateDateDifference() {
    if (this.selectedDate) {
      const currentDate = new Date();
      const selectedDateObject = new Date(this.selectedDate);
      this.weeksAway = differenceInWeeks(selectedDateObject, currentDate);
      this.monthsAway = differenceInMonths(selectedDateObject, currentDate);
      this.showMonthsWeeks = true;
    }
  }
  closeModal() {
    this.modalController.dismiss();
    this.resetstates();
  }
  ngOnInit() {
    this.loadMaintenanceList();
  }
  addmaintenancelist() {
    const newItemId = Math.random();
    const newItem: MaintenanceItem = {
      id: newItemId,
      date_time: this.selectedDatetime,
      maintenancePerson: this.maintenancePerson,
      notes: this.notes,
      flowup: {
        date: this.selectedDate,
        weeks: this.weeksAway,
        months: this.monthsAway
      }
    };
    this.maintenanceList.push(newItem);
    this.storageService.set('maintenanceList', this.maintenanceList);
    this.modalController.dismiss();
    this.resetstates();
  }
  isValidForm(): boolean {
    // Check if all required fields are filled
    return (
      !!this.selectedDatetime &&
      !!this.maintenancePerson &&
      !!this.notes &&
      !!this.selectedDate
    );
  }
  resetstates(){
    this.maintenancePerson = '';
    this.notes = '';
    this.selectedDate = '';
    this.showMonthsWeeks = false;
  }
}
