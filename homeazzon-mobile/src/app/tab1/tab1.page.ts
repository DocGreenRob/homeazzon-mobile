import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor() {
    const a = 123;
  }

  public multiplyNumber(x: number) {
    return x * 10;
  }
}
