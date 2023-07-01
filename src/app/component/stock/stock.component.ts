import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { Vehicle } from 'src/app/model/vehicle';
import {MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent {
  @Input() vehicle: Vehicle;
  @Output() onRemoveStock = new EventEmitter<number>();

  constructor(public dialog: MatDialog){
    this.vehicle = {
      manufacturer: '',
      colour: '',
      modelDescription: '',
      kilometreReading: 0,
      modelYear: 0,
      registrationNumber: '',
      vin: '',
      costPrice : 0,
      retailPrice: 0,
      dtCreated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, button: string): void {
    if (button == 'view') {
      const dialogRef = this.dialog.open(DialogViewDialog, {
        width: '400px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          dataKey: this.vehicle.id
        }
      });
      dialogRef.afterClosed().subscribe(result => {

      });
    } else if (button == 'edit') {
      const dialogRef = this.dialog.open(DialogDeleteDialog, {
        width: '400px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          dataKey: this.vehicle.id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    } else {
      const dialogRef = this.dialog.open(DialogDeleteDialog, {
        width: '400px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: {
          dataKey: this.vehicle.id
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result == 'delete')
          this.onRemoveStock.emit(this.vehicle.id);
      });
    }

  }
}

@Component({
  selector: 'delete-stock.html',
  templateUrl: './delete-stock.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogDeleteDialog {
  constructor(public dialogRef: MatDialogRef<DialogDeleteDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  deleteStock(){
    this.dialogRef.close('delete');
  }
}

export class DialogView {}
@Component({
  selector: 'view-stock.html',
  templateUrl: './view-stock.html',
  styleUrls: ['./stock.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogViewDialog {
  constructor(public dialogRef: MatDialogRef<DialogViewDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}

}

export class DialogEdit {}
@Component({
  selector: 'delete-stock.html',
  templateUrl: './delete-stock.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogEditDialog {
  constructor(public dialogRef: MatDialogRef<DialogEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  deleteStock(){
    this.dialogRef.close('delete');
  }
}
