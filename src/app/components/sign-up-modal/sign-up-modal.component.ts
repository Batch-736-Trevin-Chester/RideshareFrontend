import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UserService } from 'src/app/services/user-service/user.service';
import { User } from 'src/app/models/user';
import { Batch } from 'src/app/models/batch';
import { BatchService } from 'src/app/services/batch-service/batch.service';
import { ValidationService } from 'src/app/services/validation-service/validation.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'signupmodal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.css']
})
export class SignupModalComponent implements OnInit {

  // Form Variables (linked to nothing right now)
  fname: string;
  lname: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  isDriver: boolean;
  isRider: boolean;

  // Used for Creation (linked to form fields)
  user: User = new User();

  // Unused batch object
  // batch: Batch = new Batch();

  // Populated in onInit()
  batches: Batch[];

  // Form error messages (relevant strings are redefined and displayed when on bad submitUser())
  firstNameError: string;
  lastNameError: string;
  emailError: string;
  phoneNumberError: string;
  userNameError: string;
  batchError: string;
  hAddressError: string;
  hStateError: string;
  hCityError: string;
  hZipError: string;

  // Form Success message (redefined and displayed upon successful submitUser())
  success: string;

  // Store the retrieved template from the 'openModal' method for future use cases.
  modalRef: BsModalRef;

  // Populates state option list
  states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
    'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
    'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
    'WI', 'WY'];


  constructor(private modalService: BsModalService, private userService: UserService,
    private batchService: BatchService, private validationService: ValidationService) { }

  /*
  Uses (number of uses):
    modalService (1): shows registration modal on click of "Sign Up"
    userService (2): getting all users and adding a user
    batchService (1): getAllBatchesByLocation1, onInit populates batches array
    validationService (0)
  */


  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      res => {
        // console.log(res);
      }
    );

    this.batchService.getAllBatchesByLocation1().subscribe(
      res => {
        this.batches = res;
      },
    );
  }

  // Opens 'sign up' modal that takes in a template of type 'ng-template'.
  // Called onClick of 'sign up'
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  // MAIN SUBMISSION METHOD
  submitUser() {
    // Instantiates new user id as 0
    this.user.userId = 0;

    // Empty all error and success messages
    this.firstNameError = '';
    this.lastNameError = '';
    this.phoneNumberError = '';
    this.userNameError = '';
    this.batchError = '';
    this.emailError = '';
    this.hStateError = '';
    this.hAddressError = '';
    this.hCityError = '';
    this.hZipError = '';
    this.success = '';

    // Refers work address variables and home address variables to same string
    this.user.wAddress = this.user.hAddress;
    this.user.wState = this.user.hState;
    this.user.wCity = this.user.hCity;
    this.user.wZip = this.user.hZip;


    const driver = document.getElementById('driver') as HTMLInputElement;
    const rider = document.getElementById('rider') as HTMLInputElement;

    // Determines if Driver or Rider and sets User field
    if (driver.checked == true) {
      this.user.isDriver = true;
    }
    if (rider.checked == true) {
      this.user.isDriver = false;
    }


    const batchDefault = document.getElementById('batch') as HTMLInputElement;

    console.log(this.user);

    // NEW CODE: Validating user fields before submission

    let i = 0;

    if (this.user.userName === '') {
      this.userNameError = 'Username field required';
      i = 1;
    } else if (this.user.userName.length > 12 || this.user.userName.length < 3) {
      this.userNameError = 'Username must be between 3 and 12 characters in length';
      i = 1;
    } else if (!(this.validateUsername(this.user.userName))) {
      this.userNameError = 'Username may not have any illegal characters such as $@-';
      i = 1;
    }

    if (this.user.firstName === '') {
      this.firstNameError = 'First name field required';
      i = 1;
    } else if (this.user.firstName.length > 30) {
      this.firstNameError = 'First name cannot be more than 30 characters in length';
      i = 1;
    } else if (!(this.validateName(this.user.firstName))) {
      this.firstNameError = 'First name allows only 1 space or hyphen and no illegal characters';
      i = 1;
    }

    if (this.user.lastName === '') {
      this.lastNameError = 'Last name field required';
      i = 1;
    } else if (this.user.lastName.length > 30) {
      this.firstNameError = 'Last name cannot be more than 30 characters in length';
      i = 1;
    } else if (!(this.validateName(this.user.lastName))) {
      this.firstNameError = 'Last name allows only 1 space or hyphen and no illegal characters';
      i = 1;
    }

    if (this.user.phoneNumber === '') {
      this.phoneNumberError = 'Phone number field required';
      i = 1;
    } else if (!(this.validatePhoneNumber(this.user.phoneNumber))) {
      this.phoneNumberError = 'Invalid Phone Number';
      i = 1;
    }

    if (this.user.email === '') {
      this.emailError = 'Email field required';
      i = 1;
    } else if (!(this.validateEmail(this.user.email))) {
      this.emailError = 'Invalid email';
      i = 1;
    }

    if (this.user.userName === '') {
      this.userNameError = 'Username field required';
      i = 1;
    }

    if (this.user.batch.batchNumber < 1 || batchDefault.value === 'none') {
      this.batchError = 'Batch field required';
      i = 1;
    }

    if (this.user.hState === '') {
      this.hStateError = 'State field required';
      i = 1;
    }

    if (this.user.hAddress === '') {
      this.hAddressError = 'Address field required';
      i = 1;
    }

    if (this.user.hCity === '') {
      this.hCityError = 'City field required';
      i = 1;
    }

    if (this.user.hZip === undefined) {
      this.hZipError = 'Zipcode field required';
      i = 1;
    } else if (this.user.hZip >= 100000 || this.user.hZip <= 9999) {
      this.hZipError = 'Invalid Zipcode';
      i = 1;
    }

    if (i === 0) {
      i = 0;
      this.success = 'Registered successfully!';
    }

    // Submits user, but no user variables have been set
    this.userService.addUser(this.user).subscribe(
      res => {
        console.log(res);
        // sets i = 0; sets i = 1 on error; only displays success message if i = 1
        // let i = 0;
        // if (res.firstName != undefined) {
        //   this.firstNameError = res.firstName[0];
        //   i = 1;
        // }
        // if (res.lastName != undefined) {
        //   this.lastNameError = res.lastName[0];
        //   i = 1;

        // }
        // if (res.phoneNumber != undefined) {
        //   this.phoneNumberError = res.phoneNumber[0];
        //   i = 1;

        // }
        // if (res.email != undefined) {
        //   this.emailError = res.email[0];
        //   i = 1;

        // }
        // if (res.userName != undefined) {
        //   this.userNameError = res.userName[0];
        //   i = 1;

        // }
        // if (res.hState != undefined) {
        //   this.hStateError = res.hState[0];
        //   i = 1;

        // }
        // if (res.hAddress != undefined) {
        //   this.hAddressError = res.hAddress[0];
        //   i = 1;

        // }
        // if (res.hCity != undefined) {
        //   this.hCityError = res.hCity[0];
        //   i = 1;

        // }
        // if (res.hZip != undefined) {
        //   this.hZipError = res.hZip[0];
        //   i = 1;

        // }
        // if (i === 0) {
        //   i = 0;
        //   this.success = 'Registered successfully!';
        // }
      }
      /*res => {
            console.log("failed to add user");
            console.log(res);
          }*/
    );

  }

  // RegEx functions
  validateUsername(username) {
    const re = new RegExp('^\\w+\\.?\\w+$');
    return re.test(username);
  }

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

  // Submit on Enter
  submitOnEnter(pressEvent) {
    if (pressEvent.keyCode === 13) {
      pressEvent.preventDefault();
      this.submitUser();
    }
  }

}
