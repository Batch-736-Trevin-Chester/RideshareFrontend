import { Component, OnInit, ViewChild, TemplateRef, NgZone } from '@angular/core';
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
      name: 'name'
    },
    {
      title: 'Distance',
      name: 'distanceText',
      sort: 'distanceValue'
    },
    {
      title: 'Time',
      name: 'durationText',
      sort: 'durationValue'
    },
    {
      title: 'Total Seats',
      name: 'totalSeats',
      sort: ''
    },
    {
      title: 'Available Seats',
      name: 'avSeats',
      sort: ''
    },
    {
      title: 'Recommended',
      name: 'recommended',
      sort: ''
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

  private data: Array<any>;
  chosenCell: any;

  constructor(private http: HttpClient, private userService: UserService, private carServ: CarService, private modalServ: BsModalService,
    private ngZone: NgZone) {
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
            durationText: '',
            distanceText: '',
            durationValue: 0,
            distanceValue: 0,
            avSeats: data.availableSeats,
            totalSeats: data.seats,
            recommended: 'No'
          });
          this.filter(-1, 5 * this.miToM );
          // tslint:disable-next-line: variable-name
          const _this = this;
          setTimeout( () => {

            let count = 0;

            _this.drivers.forEach(element2 => {
              if (element2.distanceText != '') {
                count++;
              }
            });
            if (count == _this.length) {
              _this.filter(-1, 5 * _this.miToM);
              this.filterRecommended(0, 10 * _this.miToM);
            }
          } , 500);
        });
      });
    });

    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.ngZone.run(() => {
          this.getGoogleApi();
        });
      }, 2500);
    });
    // this.getGoogleApi();
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
        // tslint:disable-next-line: no-unused-expression
        new Promise(resolve => {
          const script: HTMLScriptElement = document.createElement('script');
          script.addEventListener('load', r => resolve());
          script.src = `http://maps.googleapis.com/maps/api/js?key=${response['googleMapAPIKey'][0]}`;
          document.head.appendChild(script);
        });
      }
    });
  }

  showDriversOnMap(origin, drivers) {
    drivers.forEach(element => {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
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
        // tslint:disable-next-line: object-literal-shorthand
        origin: origin,
        // tslint:disable-next-line: object-literal-shorthand
        destination: destination,
        travelMode: 'DRIVING'
        // avoidTolls: true
      },
      (response, status) => {
        if (status === 'OK') {
          display.setDirections(response);
        } else {
          alert('Could not display directions due to: ' + status);
        }
      }
    );
  }

  displayDriversList(origin, drivers) {
    // tslint:disable-next-line: prefer-const
    let origins = [];
    // set origin
    origins.push(origin);
    drivers.forEach(element => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          // tslint:disable-next-line: object-literal-shorthand
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
            element.distanceText = results[0].distance.text;
            element.durationText = results[0].duration.text;
            element.distanceValue = results[0].distance.value;
            element.durationValue = results[0].duration.value;
          }
        }
      );
    });
  }

  // --------------EXAMPLE SORT, FILTER AND PAGINATION FUNCTIONS BELOW--------------
  changePage(page: any, data: Array<any> = this.data): Array<any> {
    const start = (page.page - 1) * page.itemsPerPage;
    const end = page.itemsPerPage > -1 ? start + page.itemsPerPage : data.length;
    return data.slice(start, end);
  }

  changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    const columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    // tslint:disable-next-line: prefer-for-of
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
      if (columnName == 'distanceText') {
        columnName = 'distanceValue';
      } else if (columnName == 'durationText') {
        columnName = 'durationValue';
      }
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

    const tempArray: Array<any> = [];
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

    const filteredData = this.changeFilter(this.data, this.config);
    const sortedData = this.changeSort(filteredData, this.config);
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
      const dInM = driver.distanceValue;
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

  filterRecommended(min: number, max: number) {
    this.data = [];
    if (min > max && max != -1) {
      return;
    }

    this.drivers.forEach(driver => {
      const dInM = driver.distanceValue;
      if (dInM >= min) {
        if (max == -1) {
          this.data.push(driver);
        } else if ( dInM <= max) {
          this.data.push(driver);
          if (driver.avSeats > 0) {
            driver.recommended = 'Yes';
          }
        }
      }
    });

    this.displayDriversList(this.location, this.data);
    this.length = this.data.length;
    this.onChangeTable(this.config);
  }
}
