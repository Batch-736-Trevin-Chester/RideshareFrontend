import { CheckForms } from './forms.po';
import { browser, logging } from 'protractor';

describe('workspace-project Forms', () => {
  let page: CheckForms;

  beforeEach(() => {
    page = new CheckForms();
  });

  it('should register user', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    page.registerUser();
    expect(page.getRegistrationSuccess()).toEqual('Registered successfully!');
  });

  it('should login registered user', () => {
    page.goToHomepage();
    page.loginUser();
    expect(page.getInfoAfterLogin()).toEqual('Salvidor Migheli');
  });

  it('should update user contact info', () => {
    page.goToHomepage();
    page.loginUser();
    page.navigateToProfile();
    page.updateContactInfo();
    expect(page.getUpdateContactSuccess()).toEqual('Updated Successfully!');
  });

  // contact info errors
  it('should return contact info first name error', () => {
    page.goToHomepage();
    page.loginUser();
    page.navigateToProfile();
    expect(page.fillContactFormField('f_name', 'abcdefghijklmnopqrstuvwxyz1234567890',
      'First name cannot be more than 30 characters in length')).
      toEqual('First name cannot be more than 30 characters in length');
  });

  it('should return contact info last name error', () => {
    page.goToHomepage();
    page.loginUser();
    page.navigateToProfile();
    expect(page.fillContactFormField('l_name', 'abcdefghijklmnopqrstuvwxyz1234567890',
      'Last name cannot be more than 30 characters in length')).
      toEqual('Last name cannot be more than 30 characters in length');
  });

  it('should return contact info phone number error', () => {
    page.goToHomepage();
    page.loginUser();
    page.navigateToProfile();
    expect(page.fillContactFormField('phone', '123456789',
      'Invalid Phone Number')).
      toEqual('Invalid Phone Number');
  });

  it('should return contact info email error', () => {
    page.goToHomepage();
    page.loginUser();
    page.navigateToProfile();
    expect(page.fillContactFormField('user_email', 'stevo@yahoocom',
      'Invalid email')).
      toEqual('Invalid email');
  });

  // user location
  it('should update user location', () => {
    page.goToHomepage();
    page.loginUser();
    page.navigateToProfile();
    page.navigateToLocation();
    page.updateLocationInfo();
    expect(page.getUpdateLocationSuccess()).toEqual('Updated successfully!');
  });

  it('should update user car info', () => {
    page.goToHomepage();
    page.loginUser();
    page.navigateToProfile();
    page.navigateToCarInfo();
    page.updateCarInfo();
    expect(page.getUpdateCarSuccess()).toEqual('Updated Successfully!');
  });

  // Username error tests
  it('should return username required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('Username field required')).
      toEqual('Username field required');
  });

  it('should return username length error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('userName', 'SO',
      'Username must be between 3 and 12 characters in length')).
      toEqual('Username must be between 3 and 12 characters in length');
  });

  it('should return username illegal character error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('userName', 'rgsgr@$',
      'Username may not have any illegal characters such as $@-')).
      toEqual('Username may not have any illegal characters such as $@-');
  });

  // First name error tests
  it('should return first name required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('First name field required')).
      toEqual('First name field required');
  });

  it('should return first name length error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('firstname',
    'abcdefghijklmnopqrstuvwxyz1234567890',
    'First name cannot be more than 30 characters in length')).
      toEqual('First name cannot be more than 30 characters in length');
  });

  it('should return first name illegal character error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('firstname', 'papa-smurf-89$',
      'First name allows only 1 space or hyphen and no illegal characters')).
      toEqual('First name allows only 1 space or hyphen and no illegal characters');
  });

  // Last name error tests
  it('should return last name required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('Last name field required')).
      toEqual('Last name field required');
  });

  it('should return last name length error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('lastname',
      'abcdefghijklmnopqrstuvwxyz1234567890',
      'Last name cannot be more than 30 characters in length')).
      toEqual('Last name cannot be more than 30 characters in length');
  });

  it('should return last name illegal character error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('lastname', 'papa-smurf-89$',
      'Last name allows only 1 space or hyphen and no illegal characters')).
      toEqual('Last name allows only 1 space or hyphen and no illegal characters');
  });

  // phone number error tests
  it('should return phone number required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('Phone number field required')).
      toEqual('Phone number field required');
  });

  it('should return phone number invalid error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('phoneNumber',
      '123456789',
      'Invalid Phone Number')).
      toEqual('Invalid Phone Number');
  });

  // email error tests
  it('should return email required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('Email field required')).
      toEqual('Email field required');
  });

  it('should return email invalid error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('email',
      'stevo@yahoocom',
      'Invalid email')).
      toEqual('Invalid email');
  });

  // batch error tests
  it('should return batch required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('Batch field required')).
      toEqual('Batch field required');
  });

  // state error tests
  it('should return state required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('State field required')).
      toEqual('State field required');
  });

  // address error tests
  it('should return address required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('Address field required')).
      toEqual('Address field required');
  });

  // city error tests
  it('should return city required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('City field required')).
      toEqual('City field required');
  });

  // zipcode error tests
  it('should return zipcode required error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.getRegistrationError('Zipcode field required')).
      toEqual('Zipcode field required');
  });

  it('should return zip invalid error', () => {
    page.goToHomepage();
    page.clickRegisterButton();
    expect(page.fillRegistrationField('hZip',
      '1234',
      'Invalid Zipcode')).
      toEqual('Invalid Zipcode');
  });

//   afterEach(async () => {
//     // Assert that there are no errors emitted from the browser
//     const logs = await browser.manage().logs().get(logging.Type.BROWSER);
//     expect(logs).not.toContain(jasmine.objectContaining({
//       level: logging.Level.SEVERE,
//     } as logging.Entry));
//   });
});
