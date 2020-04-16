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

  // Form Variables (linked to form fields)
  fname: string;
  lname: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  isDriver: boolean;
  isRider: boolean;

  // Used for Creation
  user: User = new User();
  batch: Batch = new Batch();
  batches: Batch[];

  // Form error messages (relevant strings are redefined and displayed when on bad submitUser())
  firstNameError: string;
  lastNameError: string;
  emailError: string;
  phoneNumberError: string;
  userNameError: string;
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
    batchService (1): getting all batches by location
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
    this.emailError = '';
    this.hStateError = '';
    this.hAddressError = '';
    this.hCityError = '';
    this.hZipError = '';
    this.success = '';


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

    // console.log(this.user);

    // Submits user, but no user variables have been set
    this.userService.addUser(this.user).subscribe(
      res => {
        console.log(res);
        // sets i = 0; sets i = 1 on error; only displays success message if i = 1
        let i = 0;
        if (res.firstName != undefined) {
          this.firstNameError = res.firstName[0];
          i = 1;
        }
        if (res.lastName != undefined) {
          this.lastNameError = res.lastName[0];
          i = 1;

        }
        if (res.phoneNumber != undefined) {
          this.phoneNumberError = res.phoneNumber[0];
          i = 1;

        }
        if (res.email != undefined) {
          this.emailError = res.email[0];
          i = 1;

        }
        if (res.userName != undefined) {
          this.userNameError = res.userName[0];
          i = 1;

        }
        if (res.hState != undefined) {
          this.hStateError = res.hState[0];
          i = 1;

        }
        if (res.hAddress != undefined) {
          this.hAddressError = res.hAddress[0];
          i = 1;

        }
        if (res.hCity != undefined) {
          this.hCityError = res.hCity[0];
          i = 1;

        }
        if (res.hZip != undefined) {
          this.hZipError = res.hZip[0];
          i = 1;

        }
        if (i === 0) {
          i = 0;
          this.success = 'Registered successfully!';
        }
      }
      /*res => {
            console.log("failed to add user");
            console.log(res);
          }*/
    );

  }
}
