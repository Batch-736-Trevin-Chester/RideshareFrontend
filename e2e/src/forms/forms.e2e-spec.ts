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
    expect(page.getInfoAfterLogin()).toEqual('Chris Rodgers');
  });

//   afterEach(async () => {
//     // Assert that there are no errors emitted from the browser
//     const logs = await browser.manage().logs().get(logging.Type.BROWSER);
//     expect(logs).not.toContain(jasmine.objectContaining({
//       level: logging.Level.SEVERE,
//     } as logging.Entry));
//   });
});
