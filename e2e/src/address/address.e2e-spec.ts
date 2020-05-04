import { AppPage } from './address.po';
import { browser } from 'protractor';

describe('address validation testing', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display homepage heading', () => {
        page.goToHomepage();
        expect(page.getTitleText()).toEqual('RideForce');
    });

    it('should display sign up modal', () => {
        page.goToHomepage();
        page.clickSignUpButton();
        expect(page.getModalTitle()).toEqual('Sign Up');
    });

    it('should display sign up success', () => {
        page.inputFName();
        page.inputLName();
        page.inputEmail();
        page.inputPhone();
        page.inputUsername();
        page.inputBatch();
        page.inputAddress();
        page.inputCity();
        page.inputState();
        page.inputZip();
        page.inputRider();
        page.clickSignUp();
        expect(page.getSuccess()).toEqual('Registered successfully!');
    });

});
