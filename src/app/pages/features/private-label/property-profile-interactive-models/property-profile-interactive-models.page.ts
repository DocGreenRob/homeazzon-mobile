import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-property-profile-interactive-models',
  templateUrl: './property-profile-interactive-models.page.html',
  styleUrls: ['./property-profile-interactive-models.page.scss'],
})
export class PropertyProfileInteractiveModelsPage implements OnInit {
  public isIos: boolean = false;

  constructor(public platform: Platform,
    private navCtrl: NavController) {
    this.isIos = this.platform.is('ios');
  }

  ngOnInit() {
  }

  public async close() {
    this.navCtrl.pop();
  }

}
