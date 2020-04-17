import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { User } from 'src/app/models/user';
@Component({
  selector: 'app-profile-membership',
  templateUrl: './profile-membership.component.html',
  styleUrls: ['./profile-membership.component.css']
})
export class ProfileMembershipComponent implements OnInit {
  profileObject: User = new User();
  currentUser: any = '';
  success: string;
  httpResponseError: string;
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.currentUser = this.userService.getUserById2(sessionStorage.getItem('userid')).subscribe((response) => {
      this.profileObject = response;
    },
      error => {
        // logging can go here
        this.httpResponseError = 'Server not found. Try again later.';
      });
  }

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

  // Submit on Enter
  submitOnEnter(pressEvent) {
    if (pressEvent.keyCode === 13) {
      pressEvent.preventDefault();
      this.updatesMembershipInfo();
    }
  }

}
