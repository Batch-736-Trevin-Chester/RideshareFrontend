import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UserService } from 'src/app/services/user-service/user.service';
import { User } from 'src/app/models/user';
import { Batch } from 'src/app/models/batch';
import { BatchService } from 'src/app/services/batch-service/batch.service';
import { ValidationService } from 'src/app/services/validation-service/validation.service';
import { state } from '@angular/animations';
import { Address } from 'src/app/models/address';

@Component({
  selector: 'signupmodal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.css']
})
export class SignupModalComponent implements OnInit {
  fname: string;
  lname: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  isDriver: boolean;
  isRider: boolean;

  user: User = new User();
  batch: Batch = new Batch();
  batches: Batch[];
  // validation
  firstNameError: string;
  lastNameError: string;
  emailError: string;
  phoneNumberError: string;
  userNameError: string;
  hAddressError: string;
  hStateError: string;
  hCityError: string;
  hZipError: string;

  success: string;
  // Store the retrieved template from the 'openModal' method for future use cases.
  modalRef: BsModalRef;
  states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
    'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
    'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
    'WI', 'WY'];

  googleAddress: Address;
  okstatus: boolean;
  constructor(private modalService: BsModalService, private userService: UserService, private batchService: BatchService, private validationService: ValidationService) { }

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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  submitUser() {
    this.user.userId = 0;
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

    if (driver.checked == true) {
      this.user.isDriver = true;
    }
    if (rider.checked == true) {
      this.user.isDriver = false;
    }
    // console.log(this.user);
    // console.log(this.validationService.formatAddress(this.user.hAddress, this.user.hCity, this.user.hState))
    let addVal: boolean;
    this.validationService.validateAddress(this.user.hAddress, this.user.hCity, this.user.hState).subscribe(
      data => {
        console.log(data);
        if (data.status === 'OK') {
          console.log("good status");
          console.log(data.results[0].formatted_address);

          let temp = this.user.hAddress.split(' ');
          let count = 0;

          for (let c of data.results[0].address_components) {
            console.log(c.types);
            if (c.types === ['subpremise']) {
              for (let i = 0; i < temp.length; i++) {
                if (c.long_name.toLowerCase().includes(temp[i].toLowerCase()) ||
                  c.short_name.toLowerCase().includes(temp[i].toLowerCase())) {
                  count++;
                  console.log('in apt num: ' + count);
                  break;
                }
              }
            }
            if (c.types === ['street_number']) {
              for (let i = 0; i < temp.length; i++) {
                if (c.long_name.toLowerCase().includes(temp[i].toLowerCase()) ||
                  c.short_name.toLowerCase().includes(temp[i].toLowerCase())) {
                  count++;
                  console.log('in street num: ' + count);
                  break;
                }
              }
            }
            if (c.types === ['route']) {
              for (let i = 0; i < temp.length; i++) {
                if (c.long_name.toLowerCase().includes(temp[i].toLowerCase()) ||
                  c.short_name.toLowerCase().includes(temp[i].toLowerCase())) {
                  count++;
                  console.log('in street: ' + count);
                }
              }
            }
            if (c.types === ['locality', 'political']) {
              if (this.user.hCity.toLowerCase === c.short_name.toLowerCase) {
                addVal = false;
              }
            }
            if (c.types === ['postal_code']) {
              if (this.user.hZip.toString() === c.short_name) {
                addVal = false;
              }
            }
            if (c.types === ['administrative_area_level_1', 'politcal']) {
              if (this.user.hState === c.short_name) {
                addVal = false;
              }
            }
          }
          console.log(count);
          if (count > 1) {
            addVal = true;
          } else {
            addVal = false;
          }
        } else {
          addVal = false;
        }
      }
    );
    if (addVal) {
      this.userService.addUser(this.user).subscribe(
        res => {
          console.log(res);
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
    } else {
      alert('Invalid Address');
    }

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
