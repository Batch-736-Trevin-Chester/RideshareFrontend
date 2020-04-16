import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/services/car-service/car.service';
import { Car } from 'src/app/models/car';

@Component({
  selector: 'app-profile-car',
  templateUrl: './profile-car.component.html',
  styleUrls: ['./profile-car.component.css']
})
export class ProfileCarComponent implements OnInit {

  make: string;
  model: string;
  nrSeats: number;
  avSeats: number;
  currentCar: Car;
  success: string;

  constructor(private carService: CarService) { }

  ngOnInit() {

    this.carService.getCarByUserId2(sessionStorage.getItem("userid")).subscribe((response) => {
      this.currentCar = response;
      this.make = response.make;
      this.model = response.model;
      this.nrSeats = response.seats;
      this.avSeats = response.availableSeats;

    });
  }

  updatesCarInfo() {
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
        this.carService.updateCarInfo(this.currentCar);
        message.innerText = 'Updated Successfully!';
        message.style.color = 'green';
      }
    } else {
      message.innerText = 'Please fill out all fields';
      message.style.color = 'red';
    }
  }

}
