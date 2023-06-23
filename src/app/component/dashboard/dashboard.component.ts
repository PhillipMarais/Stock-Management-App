import { Component } from '@angular/core';
import { Vehicle } from '../../model/vehicle';
import { DataService } from 'src/app/shared/data.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
   vehicles: Vehicle[] = [];

  constructor(private dataService: DataService){}

  ngOnInit() : void {
    this.vehicles = this.dataService.getVehicles();
    console.log(this.vehicles);
  }
}
