import { Router } from '@angular/router';
import { AuthService } from './../../services/auth-service/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-profile-membership',
  templateUrl: './profile-membership.component.html',
  styleUrls: ['./profile-membership.component.css']
})

/*
*  Name: Chris Rodgers/Stephen Orgill		Timestamp: 4/20/20 10:19 am
*  Description: This class updates an existing user's driver/rider status and active user status information.
*/
export class ProfileMembershipComponent implements OnInit {
  profileObject: User = new User();
  currentUser: any = '';
  success: string;
  httpResponseError: string;
  
  constructor(private userService: UserService,private authService: AuthService, private router: Router) { }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:20 am
  *  Description: OnInit: Requests current user from SessionStorage and populates input fields accordingly.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  ngOnInit() {
    this.currentUser = this.userService.getUserById2(sessionStorage.getItem('userid')).subscribe((response) => {
      this.profileObject = response;
    },
      error => {
        // logging can go here
        this.httpResponseError = 'Server not found. Try again later.';
      });
  }



  // Show popup
  showPopup() {
    document.getElementById("disable_popup_wrapper").style.display = "block";
  }

  hidePopup() {
    document.getElementById("disable_popup_wrapper").style.display = "none";
  }

  logout() {
    this.currentUser = '';
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("userid");
    this.router.navigate(['']);
  }

  toggleActive() {
    if (this.profileObject.active) {
        this.profileObject.active = !this.profileObject.active;
        this.profileObject.acceptingRides = false;
        this.userService.updatePreference('active', this.profileObject.active, this.profileObject.userId);
        this.logout();
    } else {
      this.profileObject.active = !this.profileObject.active;
      this.userService.updatePreference('active', this.profileObject.active, this.profileObject.userId);
    }
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:21 am
  *  Description: Submits updated info to server.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  updatesMembershipInfo() {
    this.success = '';
    this.httpResponseError = '';
    this.userService.updateUserInfo(this.profileObject).subscribe(
      resp => {
        this.success = 'Updated Successfully!';
      }, error => {
        // logging can go here
        this.httpResponseError = 'Server error. Try again later.';
      }
    );
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:22 am
  *  Description: Linked to HTML. Executes updatesMembershipInfo() upon pressing enter.
  *  Returns void.
  */
  submitOnEnter(pressEvent) {
    if (pressEvent.keyCode === 13) {
      pressEvent.preventDefault();
      this.updatesMembershipInfo();
    }
  }

}
