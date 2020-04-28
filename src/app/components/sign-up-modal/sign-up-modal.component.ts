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
    // tslint:disable-next-line: component-selector
    selector: 'signupmodal',
    templateUrl: './sign-up-modal.component.html',
    styleUrls: ['./sign-up-modal.component.css']
})

/*
*  Name: Chris Rodgers/Stephen Orgill		Timestamp: 4/20/20 9:46 am
*  Description: This class registers a new user after validating their inputed information.
*  Form is submitted only if each field meets specific requirements.
*/
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
    httpResponseError: string;

    // Form Success message (redefined and displayed upon successful submitUser())
    success: string;

    // Store the retrieved template from the 'openModal' method for future use cases.
    modalRef: BsModalRef;

    // Populates state option list
    states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
        'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
        'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
        'WI', 'WY'];

    googleAddress: Address;
    okstatus: boolean;
    constructor(private modalService: BsModalService, private userService: UserService,
        private batchService: BatchService, private validationService: ValidationService) { }

	/*
	*  Name: Rodgers/Orgill		Timestamp: 4/20/20 9:49 am
    *  Description: OnInit: Acquires batches by location for the user to choose from.
    *   If the server is down, an error is displayed.
	*  Returns void.
	*/
    ngOnInit() {
        // this.userService.getAllUsers().subscribe(
        //     res => {
        //         // console.log(res);
        //     },
        //     error => {
        //         // logging can go here
        //         this.httpResponseError = 'Server not found. Try again later.';
        //     }
        // );

        this.batchService.getAllBatchesByLocation1().subscribe(
            res => {
                this.batches = res;
            },
            error => {
                // logging can go here
                this.httpResponseError = 'Server not found. Try again later.';
            }
        );
    }

    // Opens 'sign up' modal that takes in a template of type 'ng-template'.
    // Called onClick of 'sign up'
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

	/*
	*  Name: Rodgers/Orgill		Timestamp: 4/20/20 9:36 am
    *  Description: MAIN SUBMISSION METHOD. Validates fields through validateFieldsComplete() and validateService().
    *   Upon successful validation, submits user to server.
	*  Returns void.
	*/
    submitUser() {
        this.clearMessages();

        // Instantiates new user id as 0
        this.user.userId = 0;

        // Refers work address variables and home address variables to same string
        this.user.wAddress = this.user.hAddress;
        this.user.wState = this.user.hState;
        this.user.wCity = this.user.hCity;
        this.user.wZip = this.user.hZip;
        this.setIsDriver();
        this.user.active = true;

        // NEW CODE: Validating user fields before submission
        const fieldsValidated = this.validateFieldsComplete();
        if (fieldsValidated) {
            let addVal: boolean;
            let stateVal: boolean;
            let cityVal: boolean;
            let zipVal: boolean;
            let i = 0;

            // ValidationService provides address validation using Google API. Invalid addresses prevent user registration.
            this.validationService.validateAddress(this.user.hAddress, this.user.hCity, this.user.hState).subscribe(
                data => {
                    if (data.status === 'OK') {

                        let temp = this.user.hAddress.split(' ');
                        let count = 0;

                        for (let c of data.results[0].address_components) {
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
                                if (this.user.hCity.toLowerCase() === c.short_name.toLowerCase()) {
                                    cityVal = true;
                                } else {
                                    cityVal = false;
                                    this.hCityError = 'Invalid City';
                                    i = 1;
                                }
                            }
                            if (c.types.toString() === 'postal_code') {
                                if (this.user.hZip.toString() === c.short_name) {
                                    zipVal = true;
                                } else {
                                    zipVal = false;
                                    this.hZipError = 'Invalid Zipcode';
                                    i = 1;
                                }
                            }
                            if (c.types.toString() === 'administrative_area_level_1,political') {
                                if (this.user.hState === c.short_name) {
                                    stateVal = true;
                                } else {
                                    stateVal = false;
                                    this.hStateError = 'Invalid State';
                                    i = 1;
                                }
                            }
                        }
                        if (count > 2) {
                            addVal = true;
                        } else {
                            addVal = false;
                        }
                    } else {
                        addVal = false;
                    }
                    if (addVal && stateVal && zipVal && cityVal) {
                        this.userService.addUser(this.user).subscribe(
                            res => {
                                if (i === 0) {
                                    i = 0;
                                    this.success = 'Registered successfully!';
                                }
                            }, error => {
                                // logging can go here
                                this.httpResponseError = 'Server error. Try again later.';
                            }
                        );
                    } else {
                        this.hAddressError = 'Invalid Address.';
                        i = 1;
                    }
                }
            );
        }
    }

    /*
	*  Name: Rodgers/Orgill		Timestamp: 4/20/20 9:56 am
	*  Description: Sets all error messages back to empty strings. Called at the beginning of submitUser().
	*  Returns void.
	*/
    clearMessages() {
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
        this.httpResponseError = '';
    }

    /*
	*  Name: Rodgers/Orgill		Timestamp: 4/20/20 9:57 am
	*  Description: Sets user.isDriver based on driver/rider selection interface.
	*  Returns void.
	*/
    setIsDriver() {
        const driver = document.getElementById('driver') as HTMLInputElement;
        const rider = document.getElementById('rider') as HTMLInputElement;

        if (driver.checked == true) {
            this.user.driver = true;
        }
        if (rider.checked == true) {
            this.user.driver = false;
        }
    }

    /*
	*  Name: Rodgers/Orgill		Timestamp: 4/20/20 9:58 am
	*  Description: Checks each field against specific requirements. Called in submitUser().
	*  Returns boolean: True if no errors; false if errors exist.
	*/
    validateFieldsComplete() {

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

        const batchDefault = document.getElementById('batch') as HTMLInputElement;
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
            return true;
        }
        return false;
    }

    /*
    *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:00 am
    *  Description: Linked to HTML. Executes submitUser() upon pressing enter.
    *  Returns void.
    */
    submitOnEnter(pressEvent) {
        if (pressEvent.keyCode === 13) {
            pressEvent.preventDefault();
            this.submitUser();
        }
    }

/*
*  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:00 am
*  Description: Regex functions used for validateFieldsComplete().
*  Returns booleans: True if passing test; false if failing test.
*/
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

}
