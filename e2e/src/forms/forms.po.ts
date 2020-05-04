import { browser, by, element } from 'protractor';

export class CheckForms {

    goToHomepage() {
        return browser.get(browser.baseUrl) as Promise<any>;
    }

    clickRegisterButton() {
        element(by.css('app-root signupmodal a')).click();
    }

    registerUser() {
        element(by.id('firstname')).sendKeys('Chris');
        element(by.id('lastname')).sendKeys('Rodgers');
        element(by.id('email')).sendKeys('crodgers@gmail.com');
        element(by.id('phoneNumber')).sendKeys('5556667777');
        element(by.id('userName')).sendKeys('crod');
        element(by.id('batch')).click().then(() => {element(by.cssContainingText('option', '1 Morgantown')).click(); });
        element(by.id('hAddress')).sendKeys('111 Montesito Ln');
        element(by.id('hCity')).sendKeys('Floresville');
        element(by.id('hState')).$('[value="TX"]').click();
        element(by.id('hZip')).sendKeys('78114');
        element(by.id('rider-btn')).click();
        element(by.id('signup')).click();
    }

    getRegistrationSuccess() {
        return element(by.id('success')).getText() as Promise<string>;
    }

    loginUser() {
        element(by.css('app-root app-login a')).click();
        element(by.id('formGroupExampleInput')).sendKeys('crod');
        element(by.id('sign-in-btn')).click();
    }

    getInfoAfterLogin() {
        return element(by.className('nameplaceholder')).getText() as Promise<string>;
    }
}
