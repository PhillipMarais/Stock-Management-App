import { Injectable } from '@angular/core';
import { Vehicle } from '../model/vehicle';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public getVehicles() : Vehicle[] {
    let vehicleToSend = new Vehicle();
    vehicleToSend.registration_number = '1' ;
    vehicleToSend.manufacturer = '1' ;
    vehicleToSend.model_description ='1';
    vehicleToSend.model_year ='1';
    vehicleToSend.kms ='1';
    vehicleToSend.colour ='1';
    vehicleToSend.vin ='1';
    vehicleToSend.retail_price ='1';
    vehicleToSend.cost_price  ='1';
    vehicleToSend.dt_created ='1';
    vehicleToSend.dt_updated ='1';

    return [vehicleToSend]
  }
}
