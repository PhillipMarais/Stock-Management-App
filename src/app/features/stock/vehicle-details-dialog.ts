import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { StockItem } from '../../core/models';
import { decodeAccessories } from '../../core/stock-logic';
import { imageSrc } from './image-src';

@Component({
  selector: 'app-vehicle-details-dialog',
  imports: [MatDialogModule, MatButtonModule, CurrencyPipe, DatePipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ item.modelYear }} {{ item.manufacturer }} {{ item.modelDescription }}</h2>
    <mat-dialog-content>
      @if (images.length) {
        <img class="main" [src]="images[selected()]" [alt]="item.manufacturer + ' ' + item.modelDescription" />
        @if (images.length > 1) {
          <div class="thumbs">
            @for (src of images; track $index) {
              <button type="button" [class.active]="$index === selected()" (click)="selected.set($index)" [attr.aria-label]="'Show photo ' + ($index + 1)">
                <img [src]="src" alt="" />
              </button>
            }
          </div>
        }
      } @else {
        <p class="muted">No photos.</p>
      }

      <dl>
        <dt>Colour</dt><dd>{{ item.colour }}</dd>
        <dt>Registration</dt><dd>{{ item.registrationNumber }}</dd>
        <dt>VIN</dt><dd>{{ item.vin }}</dd>
        <dt>Kilometres</dt><dd>{{ item.kilometreReading | number }} km</dd>
        <dt>Cost price</dt><dd>{{ item.costPrice | currency: 'ZAR' : 'symbol-narrow' }}</dd>
        <dt>Retail price</dt><dd>{{ item.retailPrice | currency: 'ZAR' : 'symbol-narrow' }}</dd>
        <dt>Added</dt><dd>{{ item.dtCreated | date: 'mediumDate' }}</dd>
        <dt>Updated</dt><dd>{{ item.dtUpdated | date: 'mediumDate' }}</dd>
      </dl>

      <h3>Accessories</h3>
      @for (a of accessories; track $index) {
        <p class="accessory"><strong>{{ a.name }}</strong>@if (a.description) { — {{ a.description }} }</p>
      } @empty {
        <p class="muted">None listed.</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-flat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: `
    .main {
      display: block;
      width: 100%;
      max-height: 18rem;
      object-fit: contain;
      background: #f5f7fa;
      border-radius: 8px;
    }
    .thumbs {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .thumbs button {
      padding: 0;
      border: 2px solid transparent;
      border-radius: 6px;
      background: none;
      cursor: pointer;
    }
    .thumbs button.active {
      border-color: #005cbb;
    }
    .thumbs img {
      display: block;
      width: 4.5rem;
      height: 3rem;
      object-fit: cover;
      border-radius: 4px;
    }
    dl {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.35rem 1.25rem;
      margin: 1rem 0;
    }
    dt {
      color: #616e7c;
    }
    dd {
      margin: 0;
    }
    h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    .accessory {
      margin: 0 0 0.25rem;
    }
    .muted {
      color: #616e7c;
    }
  `,
})
export class VehicleDetailsDialog {
  protected readonly item = inject<StockItem>(MAT_DIALOG_DATA);
  protected readonly images = this.item.images.map(imageSrc);
  protected readonly accessories = decodeAccessories(this.item.accessories);
  protected readonly selected = signal(0);
}
