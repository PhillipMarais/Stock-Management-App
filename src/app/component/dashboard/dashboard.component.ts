import { Component, ViewChild } from '@angular/core';
import { Vehicle } from '../../model/vehicle';
import { DataService } from 'src/app/shared/data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('closeForm') closeForm: any;
  uploadedImage: File | undefined;
  vehicles: Vehicle[] = [];
  vehicleForm: FormGroup;
  vehiclesToDisplay: Vehicle[] = [];
  newDate: Date = new Date();
  manufacturerFilter: any;
  constructor(private datePipe: DatePipe, private dataService: DataService, private fb: FormBuilder){
    this.vehicleForm = fb.group({});
  }

  ngOnInit() : void {
    this.dataService.getVehicles().subscribe((res: Vehicle[]) => {
      this.vehicles = res;
      this.vehiclesToDisplay = this.vehicles;
      console.log(this.vehicles);
    });

    this.vehicleForm = this.fb.group({
      manufacturer: this.fb.control(''),
      colour: this.fb.control(''),
      modelDescription: this.fb.control(''),
      kilometreReading: this.fb.control(''),
      modelYear: this.fb.control(''),
      registrationNumber: this.fb.control(''),
      vin: this.fb.control(''),
      costPrice : this.fb.control(''),
      retailPrice: this.fb.control('')
    })
  }

  SearchManufacturer(){
    if(this.manufacturerFilter == ""){
      this.ngOnInit();
    } else {
      this.vehiclesToDisplay = this.vehicles.filter(res => {
        return res.manufacturer.toLowerCase().match(this.manufacturerFilter.toLowerCase());
      });
    }
  }

  addStock() {
    let vehicle: Vehicle = {
      manufacturer: this.Manufacturer.value,
      colour: this.Colour.value,
      registrationNumber: this.RegistrationNumber.value,
      modelDescription: this.ModelDescription.value,
      kilometreReading: this.KilometreReading.value,
      modelYear: this.ModelYear.value,
      vin: this.VIN.value,
      costPrice: this.CostPrice.value,
      retailPrice: this.RetailPrice.value,
      dtCreated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };

    this.fileInput.nativeElement.files
    this.dataService.createVehicle(vehicle).subscribe((res) => {
      this.vehicles = res;
      this.clearForm();
      this.closeForm.nativeElement.click();
      this.ngOnInit();
    });
  }

  removeStock(event: any) {
    this.dataService.deleteVehicle(event).subscribe((res) => {
      this.vehicles = res;
      this.ngOnInit();
    });
  }

  clearForm() {
    this.Manufacturer.setValue('');
    this.Colour.setValue('');
    this.RegistrationNumber.setValue('');
    this.ModelDescription.setValue('');
    this.KilometreReading.setValue('');
    this.ModelYear.setValue('');
    this.VIN.setValue('');
    this.CostPrice.setValue('');
    this.RetailPrice.setValue('');
    this.fileInput.nativeElement.value = '';
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

}
