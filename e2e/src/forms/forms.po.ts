import { browser, by, element } from 'protractor';

export class CheckForms {

    // Test registering a new user
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
        element(by.id('driver-btn')).click();
        element(by.id('signup')).click();
    }

    getRegistrationSuccess() {
        return element(by.id('success')).getText() as Promise<string>;
    }

    // Test logging in
    loginUser() {
        element(by.css('app-root app-login a')).click();
        element(by.id('formGroupExampleInput')).sendKeys('smigheli1');
        element(by.id('sign-in-btn')).click();
    }

    getInfoAfterLogin() {
        return element(by.className('nameplaceholder')).getText() as Promise<string>;
    }

    // Test updating contact info form
    navigateToProfile() {
        element(by.id('navbarDropdown')).click().then(() => {element(by.cssContainingText('a', 'Profile')).click(); });
    }

    updateContactInfo() {
        element(by.id('f_name')).clear();
        element(by.id('f_name')).sendKeys('Salvidor');
        element(by.id('l_name')).clear();
        element(by.id('l_name')).sendKeys('Migheli');
        element(by.id('user_email')).clear();
        element(by.id('user_email')).sendKeys('Chris.Rodgers@gmail.com');
        element(by.id('phone')).clear();
        element(by.id('phone')).sendKeys('123-456-7890');
        element(by.id('save')).click();
    }

    getUpdateContactSuccess() {
        return element(by.id('success')).getText() as Promise<string>;
    }

    // Test updating location information form
    navigateToLocation() {
        element(by.cssContainingText('button', 'Location')).click();
    }

    updateLocationInfo() {
        element(by.id('address')).clear();
        element(by.id('address')).sendKeys('111 Montesito Ln');
        element(by.id('city')).clear();
        element(by.id('city')).sendKeys('Floresville');
        element(by.id('state')).click().then(() => {element(by.cssContainingText('option', 'Texas')).click(); });
        element(by.id('zipcode')).clear();
        element(by.id('zipcode')).sendKeys('78114');
        element(by.id('save')).click();
    }

    getUpdateLocationSuccess() {
        return element(by.id('success')).getText() as Promise<string>;
    }

    // Test updating membership form
    // navigateToMembership() {

    // }

    // updateMemberInfo() {

    // }

    // getUpdateMemberSuccess() {
    //     return element(by.id('success')).getText() as Promise<string>;
    // }

    // Test updating car information form
    navigateToCarInfo() {
        element(by.cssContainingText('button', 'Car Information')).click();
    }

    updateCarInfo() {
        element(by.id('make')).clear();
        element(by.id('make')).sendKeys('Honda');
        element(by.id('model')).clear();
        element(by.id('model')).sendKeys('Civic');
        element(by.id('Avseats')).$('[value="1"]').click();
        element(by.id('Nrseats')).$('[value="3"]').click();
        element(by.id('save')).click();
    }

    getUpdateCarSuccess() {
        return element(by.id('success')).getText() as Promise<string>;
    }

    // Test registration form errors
    getRegistrationError(error) {
        element(by.id('signup')).click();
        return element(by.cssContainingText('p', error)).getText() as Promise<string>;
    }

    fillRegistrationField(field, input, error) {
        element(by.id(field)).sendKeys(input);
        element(by.id('signup')).click();
        return element(by.cssContainingText('p', error)).getText() as Promise<string>;
    }

    // Test contact update form errors
    fillContactFormField(field, input, error) {
        element(by.id(field)).clear();
        element(by.id(field)).sendKeys(input);
        element(by.id('save')).click();
        return element(by.cssContainingText('p', error)).getText() as Promise<string>;
    }
}
