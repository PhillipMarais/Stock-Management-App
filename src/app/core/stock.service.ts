import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockImage, StockItem, Vehicle } from './models';
import { attachImages } from './stock-logic';

/** Talks to the ASP.NET Core API: /api/Vehicle and /api/StockImages. */
@Injectable({ providedIn: 'root' })
export class StockService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  /** All vehicles, each with its images. */
  list(): Observable<StockItem[]> {
    return forkJoin([
      this.http.get<Vehicle[]>(`${this.api}/Vehicle`),
      this.http.get<StockImage[]>(`${this.api}/StockImages`),
    ]).pipe(map(([vehicles, images]) => attachImages(vehicles, images)));
  }

  /** Adds a vehicle, then uploads its photos (if any). */
  create(vehicle: Vehicle, photos: File[]): Observable<void> {
    return this.http.post<Vehicle[]>(`${this.api}/Vehicle`, vehicle).pipe(
      // The API returns the full list; the new vehicle is the last one
      map((all) => Number(all[all.length - 1]?.id)),
      switchMap((id) => (photos.length ? this.uploadPhotos(id, photos, 'POST') : of(undefined))),
    );
  }

  /** Saves changes. New photos, if chosen, replace the vehicle's current ones. */
  update(vehicle: Vehicle, photos: File[]): Observable<void> {
    return this.http.put<Vehicle[]>(`${this.api}/Vehicle`, vehicle).pipe(
      switchMap(() => (photos.length ? this.uploadPhotos(vehicle.id!, photos, 'PUT') : of(undefined))),
    );
  }

  /** Deletes a vehicle and its photos. */
  remove(id: number): Observable<void> {
    return this.http.delete(`${this.api}/Vehicle/${id}`).pipe(
      switchMap(() => this.http.delete(`${this.api}/StockImages/${id}`)),
      map(() => undefined),
    );
  }

  private uploadPhotos(id: number, photos: File[], method: 'POST' | 'PUT'): Observable<void> {
    const form = new FormData();
    for (const photo of photos) form.append('images', photo);
    return this.http.request(method, `${this.api}/StockImages/${id}`, { body: form }).pipe(map(() => undefined));
  }
}
