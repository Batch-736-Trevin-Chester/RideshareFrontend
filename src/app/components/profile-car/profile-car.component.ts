import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car-service/car.service';
import { Car } from 'src/app/models/car';

@Component({
  selector: 'app-profile-car',
  templateUrl: './profile-car.component.html',
  styleUrls: ['./profile-car.component.css']
})

/*
*  Name: Chris Rodgers/Stephen Orgill		Timestamp: 4/20/20 10:11 am
*  Description: This class updates an existing user's vehicle information.
*/
export class ProfileCarComponent implements OnInit {

  make: string;
  model: string;
  nrSeats: number;
  avSeats: number;
  currentCar: Car;
  success: string;
  httpResponseError: string;

  constructor(private carService: CarService) { }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:12 am
  *  Description: OnInit: Requests current user from SessionStorage and populates vehicle info fields accordingly.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  ngOnInit() {
    this.carService.getCarByUserId2(sessionStorage.getItem('userid')).subscribe((response) => {
      this.currentCar = response;
      this.make = response.make;
      this.model = response.model;
      this.nrSeats = response.seats;
      this.avSeats = response.availableSeats;

    },
      error => {
        // logging can go here
        this.httpResponseError = 'Server not found. Try again later.';
      });
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:13 am
  *  Description: Submits updated info to server.
  *  Warns user of server error if HTTP request is unsuccessful.
  */
  updatesCarInfo() {
    this.success = '';
    this.httpResponseError = '';
    const message = document.getElementById('success');
    if (this.make != '' && this.model != '' && this.nrSeats > 0) {
      if (this.avSeats > this.nrSeats) {
        message.innerText = 'too many avalable seats';
        message.style.color = 'red';
      } else {
        this.currentCar.make = this.make;
        this.currentCar.model = this.model;
        this.currentCar.seats = this.nrSeats;
        this.currentCar.availableSeats = this.avSeats;
        this.carService.updateCarInfo(this.currentCar).subscribe(
          resp => {
            message.innerText = 'Updated Successfully!';
            message.style.color = 'green';
          }, error => {
            // logging can go here
            this.httpResponseError = 'Server error. Try again later.';
          }
        );
      }
    } else {
      message.innerText = 'Please fill out all fields';
      message.style.color = 'red';
    }
  }

  /*
  *  Name: Rodgers/Orgill		Timestamp: 4/20/20 10:13 am
  *  Description: Linked to HTML. Executes updatesCarInfo() upon pressing enter.
  *  Returns void.
  */
  submitOnEnter(pressEvent) {
    if (pressEvent.keyCode === 13) {
      pressEvent.preventDefault();
      this.updatesCarInfo();
    }
  }

}
