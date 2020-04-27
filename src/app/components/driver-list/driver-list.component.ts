import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user-service/user.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Batch } from 'src/app/models/batch';
import { Car } from 'src/app/models/car';
import { CarService } from 'src/app/services/car-service/car.service';
import { Router } from '@angular/router';
import { BatchService } from 'src/app/services/batch-service/batch.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit {
  @ViewChild('map', null) mapElement: any;
  map: google.maps.Map;
  location: string = 'Morgantown, WV';
  mapProperties: {};
  availableCars: Array<any> = [];
  drivers: Array<any> = [];
  modalRef: BsModalRef;
  miToM = 1609.34375;

  //  --------EXAMPLE CODE--------
  rows: Array<any> = [];
  columns: Array<any> = [
    {
      title: 'Name',
      name: 'name',
    },
    {
      title: 'Distance',
      name: 'distance',
      sort: 'distance'
      // filtering: { filterString: '', placeholder: 'Filter by distance' }
    },
    {
      title: 'Time',
      // className: ['office-header', 'text-success'],
      name: 'duration',
      sort: 'duration2'
      // filtering: { filterString: '', placeholder: 'Filter by time' }
    },
    {
      title: 'Total Seats',
      name: 'totalSeats',
      sort: '',
    },
    {
      title: 'Available Seats',
      name: 'avSeats',
      sort: '',
    }
  ];
  public page: number = 1;
  public itemsPerPage: number = 10;
  public maxSize: number = 5;
  public numPages: number = 1;
  public length: number = 0;

  config: any = {
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };

  private totalList: Array<any>;
  private data: Array<any>;
  chosenCell: any;

  constructor(private http: HttpClient, private userService: UserService, private carServ: CarService, private modalServ: BsModalService) {
  }
  //  --------END OF EXAMPLE CODE--------

  ngOnInit(): void {

    this.drivers = [];
    this.userService.getRidersForLocation1(this.location).subscribe(res => {
      res.forEach(element => {
        this.carServ.getCarByUserId2(element.userId).subscribe((data) => {
          this.drivers.push({
            id: element.userId,
            name: element.firstName + ' ' + element.lastName,
            origin: element.hCity + ',' + element.hState,
            email: element.email,
            phone: element.phoneNumber,
            duration: '',
            distance: '',
            duration2: 0,
            distance2: 0,
            avSeats: data.availableSeats,
            totalSeats: data.seats
          });
          this.filter(-1, 5 * this.miToM );
          /* this.displayDriversList(this.location, this.data);
          this.length = this.data.length;
          this.onChangeTable(this.config); */
        });
      });
    });

    this.getGoogleApi();
    this.sleep(2000).then(() => {
      this.mapProperties = {
        center: new google.maps.LatLng(
          Number(sessionStorage.getItem('lat')),
          Number(sessionStorage.getItem('lng'))
        ),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        this.mapProperties
      );
      // get all routes
      // show drivers on map
      this.showDriversOnMap(this.location, this.drivers);
    });
  }




  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getGoogleApi() {
    this.http.get(`${environment.loginUri}getGoogleApi`).subscribe(response => {
      if (response['googleMapAPIKey'] != undefined) {
        new Promise(resolve => {
          let script: HTMLScriptElement = document.createElement('script');
          script.addEventListener('load', r => resolve());
          script.src = `http://maps.googleapis.com/maps/api/js?key=${response['googleMapAPIKey'][0]}`;
          document.head.appendChild(script);
        });
      }
    });
  }

  showDriversOnMap(origin, drivers) {
    drivers.forEach(element => {
      var directionsService = new google.maps.DirectionsService();
      var directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map: this.map
      });
      this.displayRoute(
        origin,
        element.origin,
        directionsService,
        directionsRenderer
      );
    });
  }

  displayRoute(origin, destination, service, display) {
    service.route(
      {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
        // avoidTolls: true
      },
      function (response, status) {
        if (status === 'OK') {
          display.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      }
    );
  }

  displayDriversList(origin, drivers) {
    let origins = [];
    // set origin
    origins.push(origin);
    drivers.forEach(element => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: origins,
          destinations: [element.origin],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false
        },
        (response, status) => {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
            const results = response.rows[0].elements;
            element.distance = results[0].distance.text;
            element.duration = results[0].duration.text;
            element.distance2 = results[0].distance.value;
            element.duration2 = results[0].duration.value;
          }
        }
      );
    });
  }

  // --------------EXAMPLE SORT, FILTER AND PAGINATION FUNCTIONS BELOW--------------
  changePage(page: any, data: Array<any> = this.data): Array<any> {
    let start = (page.page - 1) * page.itemsPerPage;
    let end = page.itemsPerPage > -1 ? start + page.itemsPerPage : data.length;
    return data.slice(start, end);
  }

  changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  changeFilter(data: any, config: any): any {
    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {
      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          return item[column.name].match(column.filtering.filterString);
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(
          this.config.filtering.filterString
        )
      );
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columns.forEach((column: any) => {
        if (
          item[column.name].toString().match(this.config.filtering.filterString)
        ) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    return filteredData;
  }

  onChangeTable(
    config: any,
    page: any = { page: this.page, itemsPerPage: this.itemsPerPage }
  ): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows =
      page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }

  public onCellClick(data: any, template: TemplateRef<any>): any {
    this.chosenCell = data.row;
    this.modalRef = this.modalServ.show(template);
  }

  filter(min: number, max: number) {
    this.data = [];
    if (min > max && max != -1) {
      return;
    }

    this.drivers.forEach(driver => {
      let dInM = driver.distance2;
      console.log(dInM+ ' ' + max);
      if (dInM >= min) {
        if (max == -1) {
          this.data.push(driver);
        } else if ( dInM <= max) {
          this.data.push(driver);
        }
      }
    });

    this.displayDriversList(this.location, this.data);
    this.length = this.data.length;
    this.onChangeTable(this.config);
  }
}
