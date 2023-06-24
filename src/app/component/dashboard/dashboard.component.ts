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
    this.dataService.getVehicles().subscribe((res: Vehicle[]) => {
      this.vehicles = res;
      console.log(this.vehicles);
    });
  }
}
