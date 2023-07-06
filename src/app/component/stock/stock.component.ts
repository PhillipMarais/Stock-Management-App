import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, Inject, ViewChild, ElementRef } from '@angular/core';
import { Vehicle } from 'src/app/model/vehicle';
import {MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Accessory } from 'src/app/model/accessory';
import {NgFor, NgForOf} from "@angular/common";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule  } from '@angular/forms';
import { DataService } from 'src/app/shared/data.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

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
      accessories: "",
      imagesArray:[],
      dtCreated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, button: string): void {
    if (button == 'view') {
      const dialogRef = this.dialog.open(DialogViewDialog, {
        width: '500px',
        maxWidth: '100vw',
        enterAnimationDuration,
        exitAnimationDuration,
        data: this.vehicle
      });
      dialogRef.afterClosed().subscribe(result => {

      });
    } else if (button == 'edit') {
      const dialogRef = this.dialog.open(DialogEditDialog, {
        width: '500px',
        maxWidth: '100vw',
        maxHeight: '800px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: this.vehicle
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result !='cancel'){
          this.vehicle = result;
        }
      });
    } else {
      const dialogRef = this.dialog.open(DialogDeleteDialog, {
        width: '400px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: this.vehicle
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
  templateUrl: './buttons/delete-stock.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogDeleteDialog {
  constructor(public dialogRef: MatDialogRef<DialogDeleteDialog>, @Inject(MAT_DIALOG_DATA) public data: any,) {}
  deleteStock(){
    this.dialogRef.close('delete');
  }
}

export class DialogView {}
@Component({
  selector: 'view-stock.html',
  templateUrl: './buttons/view-stock.html',
  styleUrls: ['./stock.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgForOf],
})
export class DialogViewDialog {
  vehicle: Vehicle;
  Accessories: Accessory[];
  constructor(public dialogRef: MatDialogRef<DialogViewDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
      accessories: "",
      imagesArray:[],
      dtCreated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };

    this.Accessories = [];
  }

  ngOnInit() : void {
    console.log(this.data);
    this.vehicle = this.data;

    let accesoryString = this.vehicle.accessories.split('%/%');
    accesoryString = accesoryString.filter(item => item !== ''); // remove null first/any entry

    accesoryString.forEach(accessory => {
      let newAcc = new Accessory();
      let accessoryVal = accessory.split('%-%');
      newAcc.Name = accessoryVal[0];
      newAcc.Description = accessoryVal[1];
      this.Accessories.push(newAcc);
    });
  }
}

export class DialogEdit {}
@Component({
  selector: 'edit-stock.html',
  templateUrl: './buttons/edit-stock.html',
  standalone: true,
  styleUrls: ['../dashboard/dashboard.component.css'],
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, NgForOf],
})
export class DialogEditDialog {
  vehicle: Vehicle;
  Accessories: Accessory[];
  AccessoryToAddName: string ='';
  AccessoryToAddDesc: string ='';
  vehicleForm: FormGroup;
  @ViewChild('closeForm') closeForm: any;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild("editVehicleModal",{static:true}) editVehicleModal:ElementRef | undefined;

  constructor(public dialogRef: MatDialogRef<DialogEditDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private dataService: DataService) {
    this.vehicleForm = fb.group({});

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
      accessories: "",
      imagesArray:[],
      dtCreated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };

    this.vehicleForm = this.fb.group({
      manufacturer: this.fb.control(this.data.manufacturer),
      colour: this.fb.control(this.data.colour),
      modelDescription: this.fb.control(this.data.modelDescription),
      kilometreReading: this.fb.control(this.data.kilometreReading),
      modelYear: this.fb.control(this.data.modelYear),
      registrationNumber: this.fb.control(this.data.registrationNumber),
      vin: this.fb.control(this.data.vin),
      costPrice : this.fb.control(this.data.costPrice),
      retailPrice: this.fb.control(this.data.retailPrice),
    });

    this.Accessories = [];

  }
  ngOnInit() : void {
    console.log(this.data);
    this.vehicle = this.data;

    let accesoryString = this.vehicle.accessories.split('%/%');
    accesoryString = accesoryString.filter(item => item !== ''); // remove null first/any entry

    accesoryString.forEach(accessory => {
      let newAcc = new Accessory();
      let accessoryVal = accessory.split('%-%');
      newAcc.Name = accessoryVal[0];
      newAcc.Description = accessoryVal[1];
      this.Accessories.push(newAcc);
    });
  }

  addAccessory(): void {
    let newAccesory = new Accessory();
    newAccesory.Name = this.AccessoryToAddName;
    newAccesory.Description = this.AccessoryToAddDesc;
    this.Accessories.push(newAccesory)
  }

  removeAccessory(accName: string, accDesc: string): void {
    console.log(accDesc, accName)
    const indexToRemove = this.Accessories.findIndex(
      item => item.Name === accName && item.Description === accDesc
    );
    this.Accessories.splice(indexToRemove, 1);
  }

  accessoryToAddName(value: string){
    this.AccessoryToAddName = value;
  }

  accessoryToAddDesc(value: string){
    this.AccessoryToAddDesc = value;
  }

  saveStock() {
    let accesoryString ='';
    this.Accessories.forEach(accesory => {
      accesoryString = accesoryString + '%/%' + accesory.Name + '%-%' + accesory.Description;
    });
    let vehicle: Vehicle = {
      id: this.data.id,
      manufacturer: this.Manufacturer.value,
      colour: this.Colour.value,
      registrationNumber: this.RegistrationNumber.value,
      modelDescription: this.ModelDescription.value,
      kilometreReading: this.KilometreReading.value,
      modelYear: this.ModelYear.value,
      vin: this.VIN.value,
      costPrice: this.CostPrice.value,
      retailPrice: this.RetailPrice.value,
      accessories: accesoryString,
      imagesArray:[],
      dtCreated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };

    this.fileInput.nativeElement.files
    this.dataService.updateVehicle(vehicle).subscribe((res) => {
      //this.clearForm();
      this.dialogRef.close(vehicle);
    });
  }

  public get Manufacturer(): FormControl {
    return this.vehicleForm.get('manufacturer') as FormControl;
  }
  public get Colour(): FormControl {
    return this.vehicleForm.get('colour') as FormControl;
  }
  public get RegistrationNumber(): FormControl {
    return this.vehicleForm.get('registrationNumber') as FormControl;
  }
  public get ModelDescription(): FormControl {
    return this.vehicleForm.get('modelDescription') as FormControl;
  }
  public get KilometreReading(): FormControl {
    return this.vehicleForm.get('kilometreReading') as FormControl;
  }
  public get ModelYear(): FormControl {
    return this.vehicleForm.get('modelYear') as FormControl;
  }
  public get VIN(): FormControl {
    return this.vehicleForm.get('vin') as FormControl;
  }
  public get CostPrice(): FormControl {
    return this.vehicleForm.get('costPrice') as FormControl;
  }
  public get RetailPrice(): FormControl {
    return this.vehicleForm.get('retailPrice') as FormControl;
  }

  closeModal(){
    this.dialogRef.close('cancel');
  }
}
