import { Component, OnInit, ViewChild } from '@angular/core';
import { LocalStorageService } from '@app/services/local-storage.service';
import { IonModal, ModalController } from '@ionic/angular';
import { differenceInWeeks, differenceInMonths } from 'date-fns';
// maintenance.model.ts
export interface MaintenanceItem {
  id: number
  date: string;
  time: string;
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
    private storageService: LocalStorageService
  ) { }

  loadMaintenanceList() {
    const storedMaintenanceList = this.storageService.get('maintenanceList');
    if (storedMaintenanceList) {
      this.maintenanceList = storedMaintenanceList;
    }
  }
  calculateDateDifference() {
    if (this.selectedDate) {
      const currentDate = new Date();
      const selectedDateObject = new Date(this.selectedDate);
      // Calculate weeks and months
      this.weeksAway = differenceInWeeks(selectedDateObject, currentDate);
      this.monthsAway = differenceInMonths(selectedDateObject, currentDate);
      this.showMonthsWeeks = true;
    }
  }
  closeModal() {
    this.modalController.dismiss();
    this.showMonthsWeeks = false;
  }
  ngOnInit() {
    // Load maintenance list from local storage on component initialization
    this.loadMaintenanceList();
  }
  addmaintenancelist() {
    const newItemId = Math.random();
    const newItem: MaintenanceItem = {
      id: newItemId,
      date: this.selectedDate,
      time: this.selectedDatetime,
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
    this.showMonthsWeeks = false;
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
}
