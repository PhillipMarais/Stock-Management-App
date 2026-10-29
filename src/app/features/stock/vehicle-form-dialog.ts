import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StockItem, Vehicle } from '../../core/models';
import { decodeAccessories, encodeAccessories, today } from '../../core/stock-logic';
import { imageSrc } from './image-src';

export const MAX_PHOTOS = 3;

/** What the dialog closes with when the user saves. */
export interface VehicleFormResult {
  vehicle: Vehicle;
  photos: File[];
}

@Component({
  selector: 'app-vehicle-form-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './vehicle-form-dialog.css',
  template: `
    <h2 mat-dialog-title>{{ editing ? 'Edit vehicle' : 'Add vehicle' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content>
        <div class="grid">
          <mat-form-field appearance="outline">
            <mat-label>Manufacturer</mat-label>
            <input matInput formControlName="manufacturer" />
            <mat-error>Enter the manufacturer.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Model</mat-label>
            <input matInput formControlName="modelDescription" />
            <mat-error>Enter the model.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Year</mat-label>
            <input matInput type="number" formControlName="modelYear" />
            <mat-error>Enter a year between 1900 and {{ maxYear }}.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Colour</mat-label>
            <input matInput formControlName="colour" />
            <mat-error>Enter the colour.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Registration number</mat-label>
            <input matInput formControlName="registrationNumber" />
            <mat-error>Enter the registration number.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>VIN</mat-label>
            <input matInput formControlName="vin" />
            <mat-error>Enter the VIN.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Kilometres</mat-label>
            <input matInput type="number" formControlName="kilometreReading" />
            <mat-error>Enter a reading of 0 or more.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Cost price</mat-label>
            <span matTextPrefix>R&nbsp;</span>
            <input matInput type="number" formControlName="costPrice" />
            <mat-error>Enter a price of 0 or more.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Retail price</mat-label>
            <span matTextPrefix>R&nbsp;</span>
            <input matInput type="number" formControlName="retailPrice" />
            <mat-error>Enter a price of 0 or more.</mat-error>
          </mat-form-field>
        </div>

        <h3>Accessories</h3>
        <div formArrayName="accessories" class="accessories">
          @for (group of accessories.controls; track group; let i = $index) {
            <div class="accessory" [formGroupName]="i">
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" />
                <mat-error>Enter a name.</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Description</mat-label>
                <input matInput formControlName="description" />
              </mat-form-field>
              <button mat-icon-button type="button" (click)="accessories.removeAt(i)" [attr.aria-label]="'Remove accessory ' + (i + 1)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          } @empty {
            <p class="muted">No accessories yet.</p>
          }
        </div>
        <button mat-stroked-button type="button" (click)="addAccessory()"><mat-icon>add</mat-icon>Add accessory</button>

        <h3>Photos</h3>
        <p class="muted">
          Up to {{ maxPhotos }} photos.
          @if (editing && existing.length) { Choosing new photos replaces the current ones. }
        </p>
        <div class="photos">
          @for (src of previews(); track src) {
            <img [src]="src" alt="" />
          }
        </div>
        <label class="file">
          <input type="file" accept="image/*" multiple (change)="pickPhotos($event)" />
          <span><mat-icon>photo_camera</mat-icon>Choose photos</span>
        </label>
        @if (photoError()) {
          <p class="error" role="alert">{{ photoError() }}</p>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" mat-dialog-close>Cancel</button>
        <button mat-flat-button type="submit">{{ editing ? 'Save changes' : 'Add vehicle' }}</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class VehicleFormDialog {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly ref = inject<MatDialogRef<VehicleFormDialog, VehicleFormResult>>(MatDialogRef);
  private readonly item = inject<StockItem | null>(MAT_DIALOG_DATA, { optional: true });

  protected readonly editing = !!this.item;
  protected readonly existing = this.item?.images ?? [];
  protected readonly maxPhotos = MAX_PHOTOS;
  protected readonly maxYear = new Date().getFullYear() + 1;

  protected readonly form = this.fb.group({
    manufacturer: [this.item?.manufacturer ?? '', Validators.required],
    modelDescription: [this.item?.modelDescription ?? '', Validators.required],
    modelYear: [this.item?.modelYear ?? this.maxYear - 1, [Validators.required, Validators.min(1900), Validators.max(this.maxYear)]],
    colour: [this.item?.colour ?? '', Validators.required],
    registrationNumber: [this.item?.registrationNumber ?? '', Validators.required],
    vin: [this.item?.vin ?? '', Validators.required],
    kilometreReading: [this.item?.kilometreReading ?? 0, [Validators.required, Validators.min(0)]],
    costPrice: [this.item?.costPrice ?? 0, [Validators.required, Validators.min(0)]],
    retailPrice: [this.item?.retailPrice ?? 0, [Validators.required, Validators.min(0)]],
    accessories: this.fb.array(decodeAccessories(this.item?.accessories).map((a) => this.accessoryGroup(a.name, a.description))),
  });

  protected readonly photos = signal<File[]>([]);
  protected readonly previews = signal<string[]>(this.existing.map(imageSrc));
  protected readonly photoError = signal('');

  protected get accessories(): FormArray {
    return this.form.controls.accessories;
  }

  protected addAccessory(): void {
    this.accessories.push(this.accessoryGroup('', ''));
  }

  protected pickPhotos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []).filter((f) => f.type.startsWith('image/'));
    input.value = '';
    if (!files.length) return;
    if (files.length > MAX_PHOTOS) {
      this.photoError.set(`Choose up to ${MAX_PHOTOS} photos; only the first ${MAX_PHOTOS} were kept.`);
    } else {
      this.photoError.set('');
    }
    const kept = files.slice(0, MAX_PHOTOS);
    for (const url of this.previews()) if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    this.photos.set(kept);
    this.previews.set(kept.map((f) => URL.createObjectURL(f)));
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { accessories, ...details } = this.form.getRawValue();
    const vehicle: Vehicle = {
      ...details,
      id: this.item?.id,
      accessories: encodeAccessories(accessories.filter((a) => a.name.trim())),
      // Keep the original "added" date when editing
      dtCreated: this.item?.dtCreated ?? today(),
      dtUpdated: today(),
    };
    this.ref.close({ vehicle, photos: this.photos() });
  }

  private accessoryGroup(name: string, description: string) {
    return this.fb.group({ name: [name, Validators.required], description: [description] });
  }
}
