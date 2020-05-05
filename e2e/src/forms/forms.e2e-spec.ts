import { CheckForms } from './forms.po';
import { browser, logging } from 'protractor';

describe('workspace-project Forms', () => {
  let page: CheckForms;

  beforeEach(() => {
    page = new CheckForms();
  });

// Signup modal error tests
  it('should return signup modal form errors, then successfully register a user', () => {
  page.goToHomepage();
  page.clickRegisterButton();
  expect(page.getRegistrationError('Username field required')).
    toEqual('Username field required');
  expect(page.fillRegistrationField('userName', 'SO',
    'Username must be between 3 and 12 characters in length')).
    toEqual('Username must be between 3 and 12 characters in length');
  expect(page.fillRegistrationField('userName', 'rgsgr@$',
    'Username may not have any illegal characters such as $@-')).
    toEqual('Username may not have any illegal characters such as $@-');
  expect(page.getRegistrationError('First name field required')).
    toEqual('First name field required');
  expect(page.fillRegistrationField('firstname',
  'abcdefghijklmnopqrstuvwxyz1234567890',
  'First name cannot be more than 30 characters in length')).
    toEqual('First name cannot be more than 30 characters in length');
  expect(page.fillRegistrationField('firstname', 'papa-smurf-89$',
    'First name allows only 1 space or hyphen and no illegal characters')).
    toEqual('First name allows only 1 space or hyphen and no illegal characters');
  expect(page.getRegistrationError('Last name field required')).
    toEqual('Last name field required');
  expect(page.fillRegistrationField('lastname',
    'abcdefghijklmnopqrstuvwxyz1234567890',
    'Last name cannot be more than 30 characters in length')).
    toEqual('Last name cannot be more than 30 characters in length');
  expect(page.fillRegistrationField('lastname', 'papa-smurf-89$',
    'Last name allows only 1 space or hyphen and no illegal characters')).
    toEqual('Last name allows only 1 space or hyphen and no illegal characters');
  expect(page.getRegistrationError('Phone number field required')).
    toEqual('Phone number field required');
  expect(page.fillRegistrationField('phoneNumber',
    '123456789',
    'Invalid Phone Number')).
    toEqual('Invalid Phone Number');
  expect(page.getRegistrationError('Email field required')).
    toEqual('Email field required');
  expect(page.fillRegistrationField('email',
    'stevo@yahoocom',
    'Invalid email')).
    toEqual('Invalid email');
  expect(page.getRegistrationError('Batch field required')).
    toEqual('Batch field required');
  expect(page.getRegistrationError('State field required')).
    toEqual('State field required');
  expect(page.getRegistrationError('Address field required')).
    toEqual('Address field required');
  expect(page.getRegistrationError('City field required')).
    toEqual('City field required');
  expect(page.getRegistrationError('Zipcode field required')).
    toEqual('Zipcode field required');
  expect(page.fillRegistrationField('hZip',
    '1234',
    'Invalid Zipcode')).
    toEqual('Invalid Zipcode');
  page.registerUser();
  expect(page.getRegistrationSuccess()).toEqual('Registered successfully!');
});

  it('should login registered user and update user info', () => {
    page.goToHomepage();
    page.loginUser();
    expect(page.getInfoAfterLogin()).toEqual('Salvidor Migheli');
    page.navigateToProfile();
    expect(page.fillFormField('f_name', 'abcdefghijklmnopqrstuvwxyz1234567890',
      'First name cannot be more than 30 characters in length')).
      toEqual('First name cannot be more than 30 characters in length');
    expect(page.fillFormField('l_name', 'abcdefghijklmnopqrstuvwxyz1234567890',
      'Last name cannot be more than 30 characters in length')).
      toEqual('Last name cannot be more than 30 characters in length');
    expect(page.fillFormField('phone', '123456789',
      'Invalid Phone Number')).
      toEqual('Invalid Phone Number');
    expect(page.fillFormField('user_email', 'stevo@yahoocom',
      'Invalid email')).
      toEqual('Invalid email');
    page.updateContactInfo();
    expect(page.getUpdateContactSuccess()).toEqual('Updated Successfully!');
    page.navigateToLocation();
    page.updateLocationInfo();
    expect(page.getUpdateLocationSuccess()).toEqual('Updated successfully!');
    page.navigateToCarInfo();
    page.updateCarInfo();
    expect(page.getUpdateCarSuccess()).toEqual('Updated Successfully!');
  });

//   afterEach(async () => {
//     // Assert that there are no errors emitted from the browser
//     const logs = await browser.manage().logs().get(logging.Type.BROWSER);
//     expect(logs).not.toContain(jasmine.objectContaining({
//       level: logging.Level.SEVERE,
//     } as logging.Entry));
//   });
});
