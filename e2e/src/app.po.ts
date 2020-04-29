import { browser, by, element } from 'protractor';

export class AppPage {
  goToHomepage() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  clickLoginButton() {
    element(by.css('app-root app-login a')).click();
  }

  getModalTitle() {
    return element(by.css('.modal-title')).getText() as Promise<string>;
  }

}
