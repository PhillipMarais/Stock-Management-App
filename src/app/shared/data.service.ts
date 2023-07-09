import { Injectable } from '@angular/core';
import { Vehicle } from '../model/vehicle';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private url = 'Vehicle';
  constructor(private http: HttpClient) {}

  public getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${environment.apiUrl}/${this.url}`);
  }

  public createVehicle(vehicle: Vehicle): Observable<Vehicle[]> {
    return this.http.post<Vehicle[]>(
      `${environment.apiUrl}/${this.url}`,
      vehicle
    );
  }

  public updateVehicle(vehicle: Vehicle): Observable<Vehicle[]> {
    return this.http.put<Vehicle[]>(
      `${environment.apiUrl}/${this.url}`,
      vehicle
    );
  }

  public deleteVehicle(id: number): Observable<Vehicle[]> {
    return this.http.delete<Vehicle[]>(
      `${environment.apiUrl}/${this.url}/${id}`
    );
  }

  public getStockImages(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/StockImages`);
  }

  public updateStockImage(files: FileList, id: number): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    return this.http.put<any>(
      `${environment.apiUrl}/StockImages/${id}`,
      formData
    );
  }

  public createStockImage(files: FileList, id: number): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    return this.http.post<any>(
      `${environment.apiUrl}/StockImages/${id}`,
      formData
    );
  }

  public deleteStockImage(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/StockImages/${id}`);
  }
}
