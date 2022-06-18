import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getPageTitle() {
    //var a = element(by.className('ion-title')).getText();
    //debugger;
    //alert(a);
    return element(by.className('ion-title')).getText();
  }
}
