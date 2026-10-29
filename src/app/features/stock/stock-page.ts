import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, Observable, switchMap } from 'rxjs';
import { StockItem } from '../../core/models';
import { matchesSearch } from '../../core/stock-logic';
import { StockService } from '../../core/stock.service';
import { ConfirmData, ConfirmDialog } from './confirm-dialog';
import { imageSrc } from './image-src';
import { VehicleDetailsDialog } from './vehicle-details-dialog';
import { VehicleFormDialog, VehicleFormResult } from './vehicle-form-dialog';

@Component({
  selector: 'app-stock-page',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './stock-page.css',
  template: `
    <header class="bar">
      <h1>Vehicle stock</h1>
      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="search">
        <mat-icon matPrefix>search</mat-icon>
        <mat-label>Search make, model, year, km, registration or VIN</mat-label>
        <input matInput [value]="query()" (input)="query.set($any($event.target).value)" />
      </mat-form-field>
      <button mat-flat-button (click)="add()"><mat-icon>add</mat-icon>Add vehicle</button>
    </header>

    <div class="table-wrap">
      @if (loading()) {
        <mat-progress-bar mode="indeterminate" />
      }
      <table mat-table [dataSource]="dataSource" matSort matSortActive="dtUpdated" matSortDirection="desc">
        <ng-container matColumnDef="photo">
          <th mat-header-cell *matHeaderCellDef><span class="sr-only">Photo</span></th>
          <td mat-cell *matCellDef="let item">
            @if (item.images.length) {
              <img class="thumb" [src]="thumb(item)" alt="" />
            } @else {
              <span class="thumb empty"><mat-icon>directions_car</mat-icon></span>
            }
          </td>
        </ng-container>
        <ng-container matColumnDef="manufacturer">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Make</th>
          <td mat-cell *matCellDef="let item">{{ item.manufacturer }}</td>
        </ng-container>
        <ng-container matColumnDef="modelDescription">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Model</th>
          <td mat-cell *matCellDef="let item">{{ item.modelDescription }}</td>
        </ng-container>
        <ng-container matColumnDef="modelYear">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Year</th>
          <td mat-cell *matCellDef="let item">{{ item.modelYear }}</td>
        </ng-container>
        <ng-container matColumnDef="kilometreReading">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Km</th>
          <td mat-cell *matCellDef="let item">{{ item.kilometreReading | number }}</td>
        </ng-container>
        <ng-container matColumnDef="registrationNumber">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Registration</th>
          <td mat-cell *matCellDef="let item">{{ item.registrationNumber }}</td>
        </ng-container>
        <ng-container matColumnDef="retailPrice">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Retail</th>
          <td mat-cell *matCellDef="let item">{{ item.retailPrice | currency: 'ZAR' : 'symbol-narrow' : '1.0-0' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef><span class="sr-only">Actions</span></th>
          <td mat-cell *matCellDef="let item" class="actions">
            <button mat-icon-button matTooltip="View" (click)="view(item)" [attr.aria-label]="'View ' + label(item)">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Edit" (click)="edit(item)" [attr.aria-label]="'Edit ' + label(item)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Delete" (click)="remove(item)" [attr.aria-label]="'Delete ' + label(item)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns"></tr>
        <tr class="mat-mdc-row" *matNoDataRow>
          <td class="mat-mdc-cell no-data" [attr.colspan]="columns.length">
            @if (loading()) {
              Loading stock…
            } @else if (error()) {
              {{ error() }}
            } @else if (query()) {
              No vehicles match “{{ query() }}”.
            } @else {
              No vehicles yet. Add your first one.
            }
          </td>
        </tr>
      </table>
      <mat-paginator [pageSizeOptions]="[5, 10, 25]" [pageSize]="10" showFirstLastButtons aria-label="Choose page" />
    </div>
  `,
})
export class StockPage {
  private readonly stock = inject(StockService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  protected readonly columns = ['photo', 'manufacturer', 'modelDescription', 'modelYear', 'kilometreReading', 'registrationNumber', 'retailPrice', 'actions'];
  protected readonly items = signal<StockItem[]>([]);
  protected readonly query = signal('');
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly dataSource = new MatTableDataSource<StockItem>([]);
  private readonly sort = viewChild.required(MatSort);
  private readonly paginator = viewChild.required(MatPaginator);
  private readonly thumbs = computed(() => new Map(this.items().map((i) => [i, i.images[0] ? imageSrc(i.images[0]) : ''])));

  constructor() {
    this.dataSource.filterPredicate = (item, q) => matchesSearch(item, q);
    effect(() => {
      this.dataSource.sort = this.sort();
      this.dataSource.paginator = this.paginator();
    });
    effect(() => (this.dataSource.data = this.items()));
    effect(() => {
      this.dataSource.filter = this.query();
      this.dataSource.paginator?.firstPage();
    });
    this.load();
  }

  protected thumb(item: StockItem): string {
    return this.thumbs().get(item) ?? '';
  }

  protected label(item: StockItem): string {
    return `${item.modelYear} ${item.manufacturer} ${item.modelDescription}`;
  }

  protected view(item: StockItem): void {
    this.dialog.open(VehicleDetailsDialog, { data: item, width: '36rem', maxWidth: '95vw', autoFocus: false });
  }

  protected add(): void {
    this.openForm(null)
      .pipe(switchMap(({ vehicle, photos }) => this.stock.create(vehicle, photos)))
      .subscribe(this.done('Vehicle added.'));
  }

  protected edit(item: StockItem): void {
    this.openForm(item)
      .pipe(switchMap(({ vehicle, photos }) => this.stock.update(vehicle, photos)))
      .subscribe(this.done('Changes saved.'));
  }

  protected remove(item: StockItem): void {
    const data: ConfirmData = {
      title: 'Delete vehicle?',
      message: `${this.label(item)} (${item.registrationNumber}) and its photos will be removed. This can't be undone.`,
      confirm: 'Delete',
    };
    this.dialog
      .open(ConfirmDialog, { data, width: '26rem' })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.stock.remove(item.id!)),
      )
      .subscribe(this.done('Vehicle deleted.'));
  }

  private openForm(item: StockItem | null): Observable<VehicleFormResult> {
    return this.dialog
      .open<VehicleFormDialog, StockItem | null, VehicleFormResult>(VehicleFormDialog, {
        data: item,
        width: '48rem',
        maxWidth: '95vw',
        disableClose: true,
      })
      .afterClosed()
      .pipe(filter((result): result is VehicleFormResult => !!result));
  }

  /** Shows the outcome and reloads the list after any change. */
  private done(message: string) {
    return {
      next: () => {
        this.snack.open(message, undefined, { duration: 3000 });
        this.load();
      },
      error: () => this.snack.open("That didn't save. Check the API is running and try again.", 'Dismiss', { duration: 6000 }),
    };
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.stock.list().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Couldn't load stock. Check the API is running.");
        this.loading.set(false);
      },
    });
  }
}
