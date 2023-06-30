import { Injectable } from '@angular/core';
import { Vehicle } from '../model/vehicle';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = "Vehicle";
  constructor(private http: HttpClient) { }

  public getVehicles() : Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${environment.apiUrl}/${this.url}`);
  }

  public createVehicle(vehicle: Vehicle) : Observable<Vehicle[]> {
    return this.http.post<Vehicle[]>(`${environment.apiUrl}/${this.url}`, vehicle);
  }

  public updateVehicle(vehicle: Vehicle) : Observable<Vehicle[]>{
    return this.http.put<Vehicle[]>(`${environment.apiUrl}/${this.url}`, vehicle);
  }

  public deleteVehicle(id: number): Observable<Vehicle[]> {
    return this.http.delete<Vehicle[]>(`${environment.apiUrl}/${this.url}/${id}`);
  }
}
