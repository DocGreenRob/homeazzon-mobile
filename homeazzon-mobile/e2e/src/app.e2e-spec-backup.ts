import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    browser.ignoreSynchronization = true;
    //page.navigateTo('/');
    browser.driver.sleep(1000);
  });

  it('should display welcome message', () => {
    page.navigateTo();
    browser.driver.sleep(10000);
    
    expect(page.getPageTitle()).toContain('Tab 123');
  });
});
