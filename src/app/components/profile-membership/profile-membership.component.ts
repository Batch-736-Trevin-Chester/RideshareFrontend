import { Component, OnInit } from '@angular/core';
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
  constructor(private userService: UserService) { }

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
