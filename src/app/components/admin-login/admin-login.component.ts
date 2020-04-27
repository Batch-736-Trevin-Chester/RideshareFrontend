import { Component, OnInit, TemplateRef } from '@angular/core';
import { Admin } from 'src/app/models/admin';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { AdminService } from 'src/app/services/admin-service/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

	admins: Admin[] = [];
	OTPincorrectError: string;
	OTPsubmitted: string;
	OTPerror: string;

	chosenAdmin: Admin;
	userName: string = '';

	failed: boolean = false;
	modalRef: BsModalRef;
	pleaseWaitmsg: string;
	httpResponseError: string;
	adminLoginObject: any;

 constructor(private modalService: BsModalService, private http: HttpClient, private authService: AuthService,
	private adminService: AdminService) { }

 ngOnInit() {
    this.adminService.getAllAdmins()
        .subscribe(allAdmins => {
          this.admins = allAdmins;
          this.chosenAdmin = this.admins[0];
      });
  }

 openModal(template: TemplateRef<any>) {
	this.modalRef = this.modalService.show(template);
  }

 changeAdmin(event) {
    this.chosenAdmin = this.admins[event.target.selectedIndex];
  }

	loginFailed() {
		this.userName = '';
		this.failed = true;
	}

	login() {
		this.pleaseWaitmsg = 'Please Wait';
		this.http.get<Admin>(`${environment.adminUri}${this.chosenAdmin.userName}`)
			.subscribe((admin: Admin) => {

				if (!admin.adminId) {
					this.loginFailed();
				} else if (!this.authService.loginAsAdmin(admin, this.userName)) {
						this.loginFailed();
				} else {
					this.chosenAdmin = admin;
					document.getElementById('openModalButton').click();
					this.pleaseWaitmsg = '';
				}
			});
	}

	submitVerificationOnEnter(pressEvent) {
		if (pressEvent.keyCode === 13) {
			pressEvent.preventDefault();
			this.submitVerificationCode();
		}
	}

	submitVerificationCode() {
		this.OTPerror = '';
		this.httpResponseError = '';
		if (this.OTPsubmitted) {
			// Http Method returns Admin object
			this.adminService.adminVerificationSubmission(this.OTPsubmitted).subscribe(
				response => {
					if (response == 'Failure') {
						this.OTPincorrectError = 'Verification code did not match';
						this.chosenAdmin = null;
					} else {
						// call landing page
						location.replace('admin');
					}
				},
				(error) => {
					// this.log.error(error); [previous logging functionality]
					this.httpResponseError = 'Cannot login at this time. Please try again later.';
				}
			);
		}
	}

}
