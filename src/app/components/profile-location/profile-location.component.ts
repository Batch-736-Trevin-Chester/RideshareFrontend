import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { User } from 'src/app/models/user';
import { ValidationService } from 'src/app/services/validation-service/validation.service';

@Component({
  selector: 'app-profile-location',
  templateUrl: './profile-location.component.html',
  styleUrls: ['./profile-location.component.css']
})

/*
*  Name: Chris Rodgers/Stephen Orgill		Timestamp: 4/20/20 10:14 am
*  Description: This class updates an existing user's location information. Uses ValidationService address checks.
*
*/
export class ProfileLocationComponent implements OnInit {

  zipcode: number;
  city: string;
  address: string;
  address2: string;
  hState: string;
  currentUser: User;
  success: string;
  error: string;
  addError: string;
  httpResponseError: string;

  constructor(private currentUserService: UserService, private validationService: ValidationService) { }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:16 am
  *  Description: OnInit: Requests current user from SessionStorage and populates input fields accordingly.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  ngOnInit() {
    this.currentUserService.getUserById2(sessionStorage.getItem('userid')).subscribe((response) => {
      this.currentUser = response;
      this.zipcode = response.hZip;
      this.city = response.hCity;
      this.address = response.hAddress;
      this.address2 = response.wAddress;
      this.hState = response.hState;

    },
    error => {
      // logging can go here
      this.httpResponseError = 'Server not found. Try again later.';
    });
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:16 am
  *  Description: Submits updated info to server if address requirements are met.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  updateAddressInfo() {
    this.success = '';
    this.httpResponseError = '';
    this.currentUser.hZip = this.zipcode;
    this.currentUser.hCity = this.city;
    this.currentUser.hAddress = this.address;
    this.currentUser.wAddress = this.address2;
    this.currentUser.hState = this.hState;

    let addVal: boolean;
    let stateVal: boolean;
    let cityVal: boolean;
    let zipVal: boolean;
    let i = 0;
    this.validationService.validateAddress(this.currentUser.hAddress, this.currentUser.hCity, this.currentUser.hState).subscribe(
      data => {
        if (data.status === 'OK') {

          const temp = this.currentUser.hAddress.split(' ');
          let count = 0;

          for (const c of data.results[0].address_components) {
            if (c.types.toString() === 'subpremise') {
              for (let i = 0; i < temp.length; i++) {
                if (c.long_name.toLowerCase().includes(temp[i].toLowerCase()) ||
                  c.short_name.toLowerCase().includes(temp[i].toLowerCase())) {
                  count++;
                }
              }
            }
            if (c.types.toString() === 'street_number') {
              for (let i = 0; i < temp.length; i++) {
                if (c.long_name.toLowerCase().includes(temp[i].toLowerCase()) ||
                  c.short_name.toLowerCase().includes(temp[i].toLowerCase())) {
                  count++;
                }
              }
            }
            if (c.types.toString() === 'route') {
              for (let i = 0; i < temp.length; i++) {
                if (c.long_name.toLowerCase().includes(temp[i].toLowerCase()) ||
                  c.short_name.toLowerCase().includes(temp[i].toLowerCase())) {
                  count++;
                }
              }
            }
            if (c.types.toString() === 'locality,political') {
              if (this.currentUser.hCity.toLowerCase() === c.short_name.toLowerCase()) {
                cityVal = true;
              } else {
                cityVal = false;
                this.error = 'Invalid City';
                this.addError = '';
                this.success = '';
              }
            }
            if (c.types.toString() === 'postal_code') {
              if (this.currentUser.hZip.toString() === c.short_name) {
                zipVal = true;
              } else {
                zipVal = false;
                this.error = 'Invalid Zip Code';
                this.addError = '';
                this.success = '';
              }
            }
            if (c.types.toString() === 'administrative_area_level_1,political') {
              if (this.currentUser.hState === c.short_name) {
                stateVal = true;
              } else {
                stateVal = false;
                this.error = 'Invalid State';
                this.addError = '';
                this.success = '';
              }
            }
          }
          if (count > 2) {
            addVal = true;
          } else {
            addVal = false;
            i = 1;
          }
        } else {
          addVal = false;
          i = 1;
        }
        if (addVal && stateVal && zipVal && cityVal) {
          this.error = '';
          this.addError = '';
          this.currentUserService.updateUserInfo(this.currentUser).subscribe(
            res => {
              this.success = 'Updated successfully!';
            }, error => {
              // logging can go here
              this.httpResponseError = 'Server error. Try again later.';
            }
          );
        } else {
          if (i === 1) {
            this.addError = 'Invalid Address';
            this.error = '';
            this.success = '';
            i = 0;
          }
        }
      }
    );
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:17 am
  *  Description: Linked to HTML. Executes updateAddressInfo() upon pressing enter.
  *  Returns void.
  */
  submitOnEnter(pressEvent) {
    if (pressEvent.keyCode === 13) {
      pressEvent.preventDefault();
      this.updateAddressInfo();
    }
  }
}
