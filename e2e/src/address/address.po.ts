import { browser, by, element } from 'protractor';

export class AppPage {
    goToHomepage() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    getTitleText() {
        return element(by.css('app-root h1')).getText() as Promise<string>;
    }

    clickSignUpButton() {
        element(by.css('app-root signupmodal')).click();
    }

    getModalTitle() {
        return element(by.css('.modal-title')).getText() as Promise<string>;
    }

    getSuccess() {
        return element(by.css('.success')).getText() as Promise<string>;
    }

    inputFName() {
        element(by.css('#firstname')).sendKeys('test');
    }

    inputLName() {
        element(by.css('#lastname')).sendKeys('test');
    }

    inputEmail() {
        element(by.css('#email')).sendKeys('test@test.com');
    }

    inputPhone() {
        element(by.css('#phoneNumber')).sendKeys('1234567890');
    }

    inputUsername() {
        element(by.css('#userName')).sendKeys('test');
    }

    inputBatch() {
        element(by.css('#batch')).sendKeys('1');
    }

    inputAddress() {
        element(by.css('#hAddress')).sendKeys('14525 Prism Circle');
    }

    inputCity() {
        element(by.css('#hCity')).sendKeys('Tampa');
    }

    inputState() {
        element(by.css('#hState')).sendKeys('fl');
    }

    inputZip() {
        element(by.css('#hZip')).sendKeys('33613');
    }

    inputRider() {
        element(by.css('#rider')).click();
    }

    clickSignUp() {
        element(by.css('#signup')).click();
    }

}
