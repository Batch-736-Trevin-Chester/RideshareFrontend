import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile-contact',
  templateUrl: './profile-contact.component.html',
  styleUrls: ['./profile-contact.component.css']
})

/*
*  Name: Chris Rodgers/Stephen Orgill		Timestamp: 4/20/20 10:02 am
*  Description: This class updates an existing user's contact information. Uses similar checks to the Sign-Up-Modal.
*  Form is submitted only if each field meets specific requirements.
*/
export class ProfileContactComponent implements OnInit {

  profileObject: User;
  currentUser: any = '';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  success: string;

  // Form Error messages
  firstNameError: string;
  lastNameError: string;
  emailError: string;
  phoneNumberError: string;
  serverResponseError: string;
  httpResponseError: string;


  constructor(private router: Router, private userService: UserService) { }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:04 am
  *  Description: OnInit: Requests current user from SessionStorage and populates input fields accordingly.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  ngOnInit() {
    this.currentUser = this.userService.getUserById2(sessionStorage.getItem('userid')).subscribe((response) => {
      this.profileObject = response;

      this.firstName = this.profileObject.firstName;
      this.lastName = this.profileObject.lastName;
      this.email = this.profileObject.email;
      this.phone = this.profileObject.phoneNumber;

    },
    error => {
      // logging can go here
      this.httpResponseError = 'Server not found. Try again later.';
    });

  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:06 am
  *  Description: Submits updated info to server if requirements are met.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  updatesContactInfo() {
    this.clearMessages();
    this.profileObject.firstName = this.firstName;
    this.profileObject.lastName = this.lastName;
    this.profileObject.email = this.email;
    this.profileObject.phoneNumber = this.phone;
    const passValidation = this.validateFields();
    if (passValidation) {
      this.userService.updateUserInfo(this.profileObject).subscribe(
        resp => {
          if (resp === null) {
            this.serverResponseError = 'Update Unsuccessful';
          } else {
            this.success = 'Updated Successfully!';
          }
        },
        (error) => {
          // this.log.error(error); [previous logging functionality]
          this.httpResponseError = 'Server error. Try again later.';
        }
      );
    }
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:07 am
  *  Description: Sets all error messages back to empty strings. Called at the beginning of updatesContactInfo().
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  clearMessages() {
    this.firstNameError = '';
    this.lastNameError = '';
    this.phoneNumberError = '';
    this.emailError = '';
    this.success = '';
    this.serverResponseError = '';
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:07 am
	*  Description: Checks each field against specific requirements. Called in updatesContactInfo().
	*  Returns boolean: True if no errors; false if errors exist.
  */
  validateFields(): boolean {
    let i = 0;
    if (this.profileObject.firstName === '') {
      this.firstNameError = 'First name field required';
      i = 1;
    } else if (this.profileObject.firstName.length > 30) {
      this.firstNameError = 'First name cannot be more than 30 characters in length';
      i = 1;
    } else if (!(this.validateName(this.profileObject.firstName))) {
      this.firstNameError = 'First name allows only 1 space or hyphen and no illegal characters';
      i = 1;
    }

    if (this.profileObject.lastName === '') {
      this.lastNameError = 'Last name field required';
      i = 1;
    } else if (this.profileObject.lastName.length > 30) {
      this.lastNameError = 'Last name cannot be more than 30 characters in length';
      i = 1;
    } else if (!(this.validateName(this.profileObject.lastName))) {
      this.lastNameError = 'Last name allows only 1 space or hyphen and no illegal characters';
      i = 1;
    }

    if (this.profileObject.phoneNumber === '') {
      this.phoneNumberError = 'Phone number field required';
      i = 1;
    } else if (!(this.validatePhoneNumber(this.profileObject.phoneNumber))) {
      this.phoneNumberError = 'Invalid Phone Number';
      i = 1;
    }

    if (this.profileObject.email === '') {
      this.emailError = 'Email field required';
      i = 1;
    } else if (!(this.validateEmail(this.profileObject.email))) {
      this.emailError = 'Invalid email';
      i = 1;
    }

    if (i === 1) {
      return false;
    } else {
      return true;
    }

  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:10 am
  *  Description: Linked to HTML. Executes updatesContactInfo() upon pressing enter.
  *  Returns void.
  */
  submitOnEnter(pressEvent) {
    if (pressEvent.keyCode === 13) {
      pressEvent.preventDefault();
      this.updatesContactInfo();
    }
  }

/*
*  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:10 am
*  Description: Regex functions used for validateFieldsComplete().
*  Returns booleans: True if passing test; false if failing test.
*/

  validateName(name) {
    const re = new RegExp('^[a-zA-Z\\u00C0-\\u017F]+[- ]?[a-zA-Z\\u00C0-\\u017F]+$');
    return re.test(name);
  }

  validatePhoneNumber(num) {
    const re = new RegExp('^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$');
    return re.test(num);
  }

  validateEmail(email) {
    const re = new RegExp('^\\w+\\.?\\w+@\\w+\\.[a-zA-Z]{2,4}$');
    return re.test(email);
  }

}
