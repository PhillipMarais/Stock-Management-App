import { Component, Input, ViewChild } from '@angular/core';
import { Vehicle } from '../../model/vehicle';
import { DataService } from 'src/app/shared/data.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { Accessory } from 'src/app/model/accessory';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('closeForm') closeForm: any;
  uploadedImage: File | undefined;
  vehicles: Vehicle[] = [];
  vehicleForm: FormGroup;
  vehiclesToDisplay: Vehicle[] = [];
  newDate: Date = new Date();
  reverse: boolean = false;

  Accessories: Accessory[];
  AccessoryToAddName: string = '';
  AccessoryToAddDesc: string = '';

  stockDetailsFilter: any;

  page: number = 1;
  tableSize: number = 3;
  tablesizes: any = [5, 10, 15, 20];
  count: number = 0;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.vehicleForm = fb.group({});
    this.Accessories = [];
  }

  ngOnInit(): void {
    this.dataService.getVehicles().subscribe((res: Vehicle[]) => {
      this.vehiclesToDisplay = this.vehicles = res;
      this.dataService
        .getStockImages()
        .subscribe((res: { id: number; stockId: number; image: string }[]) => {
          for (const vehicle of this.vehicles) {
            const matchingImages = res.filter(
              (image) => image.stockId === vehicle.id
            );
            for (const image of matchingImages) {
              if (vehicle.imagesArray) {
                vehicle.imagesArray.push(image.image);
              } else {
                vehicle.imagesArray = [image.image];
              }
            }
          }
        });
    });

    this.vehicleForm = this.fb.group({
      manufacturer: this.fb.control(''),
      colour: this.fb.control(''),
      modelDescription: this.fb.control(''),
      kilometreReading: this.fb.control(''),
      modelYear: this.fb.control(''),
      registrationNumber: this.fb.control(''),
      vin: this.fb.control(''),
      costPrice: this.fb.control(''),
      retailPrice: this.fb.control(''),
    });
  }

  //------------PAGINTATION------------
  onTableDataChange(event: any) {
    this.page = event;
    this.ngOnInit();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.ngOnInit();
  }

  //------------SORTING------------

  /*
  Sorts the vehicle list we display depending on which sorted button was selected
  */
  sort(key: string) {
    if (key == 'manufacturer') {
      if (this.reverse) {
        this.vehiclesToDisplay.sort((a, b) =>
          b.manufacturer.localeCompare(a.manufacturer)
        );
      } else
        this.vehiclesToDisplay.sort((a, b) =>
          a.manufacturer.localeCompare(b.manufacturer)
        );
      this.reverse = !this.reverse;
    } else if (key == 'model') {
      if (this.reverse) {
        this.vehiclesToDisplay.sort((a, b) =>
          b.modelDescription.localeCompare(a.modelDescription)
        );
      } else
        this.vehiclesToDisplay.sort((a, b) =>
          a.modelDescription.localeCompare(b.modelDescription)
        );
      this.reverse = !this.reverse;
    } else if (key == 'costPrice') {
      if (this.reverse) {
        this.vehiclesToDisplay.sort((a, b) => b.costPrice - a.costPrice);
      } else {
        this.vehiclesToDisplay.sort((a, b) => a.costPrice - b.costPrice);
      }
      this.reverse = !this.reverse;
    } else {
      if (this.reverse) {
        this.vehiclesToDisplay.sort((a, b) => b.retailPrice - a.retailPrice);
      } else {
        this.vehiclesToDisplay.sort((a, b) => a.retailPrice - b.retailPrice);
      }
      this.reverse = !this.reverse;
    }
  }

  //------------FILTER------------
  SearchDetais() {
    if (this.stockDetailsFilter == '') {
      this.ngOnInit();
      this.applyOtherFilters();
    } else {
      this.vehiclesToDisplay = this.vehicles.filter((res) => {
        const manufacturerMatch = res.manufacturer
          .toLowerCase()
          .includes(this.stockDetailsFilter.toLowerCase());
        const modelYearMatch = res.modelYear
          .toString()
          .includes(this.stockDetailsFilter);
        const kilometeresMatch = res.kilometreReading
          .toString()
          .includes(this.stockDetailsFilter);

        return manufacturerMatch || modelYearMatch || kilometeresMatch;
      });
    }
  }

  applyOtherFilters() {}

  //------------ADDING A STOCK------------
  addStock() {
    let accesoryString = '';
    const files: FileList = this.fileInput.nativeElement.files;
    this.Accessories.forEach((accesory) => {
      accesoryString =
        accesoryString + '%/%' + accesory.Name + '%-%' + accesory.Description;
    });
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
      accessories: accesoryString,
      imagesArray: [],
      dtCreated: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };

    this.dataService.createVehicle(vehicle).subscribe(
      (res) => {
        let id = Number(res[res.length - 1].id);
        if (files.length > 0) {
          this.dataService.createStockImage(files, id).subscribe(
            (response) => {
              this.vehicles = response;
              this.clearForm();
              this.closeForm.nativeElement.click();
              this.ngOnInit();
              this.showCustomToast(
                'Stock added',
                'New stock has been successfully added.'
              );
            },
            (error) => {
              console.error('Error uploading file:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
      }
    );
  }

  accessoryToAddName(value: string) {
    this.AccessoryToAddName = value;
  }

  accessoryToAddDesc(value: string) {
    this.AccessoryToAddDesc = value;
  }

  addAccessory(): void {
    let newAccesory = new Accessory();
    newAccesory.Name = this.AccessoryToAddName;
    newAccesory.Description = this.AccessoryToAddDesc;
    this.Accessories.push(newAccesory);
  }

  removeAccessory(accName: string, accDesc: string): void {
    const indexToRemove = this.Accessories.findIndex(
      (item) => item.Name === accName && item.Description === accDesc
    );
    this.Accessories.splice(indexToRemove, 1);
  }

  removeStock(event: any) {
    var hasImage = false;
    this.dataService.deleteVehicle(event).subscribe((res) => {
      this.dataService.deleteStockImage(event).subscribe((res) => {
        this.vehicles = res;
        this.ngOnInit();
      });
    });
  }

  onFileChange(fileInput: HTMLInputElement) {
    const files = fileInput.files;
    if (files && files.length > 3) {
      fileInput.value = '';
      this.showCustomToast(
        'Warning',
        'You can only select up to three images to upload.'
      );
      return;
    }
  }

  //function for creating alerts
  showCustomToast(heading: string, message: string) {
    const toastElement = document.getElementById('liveToast');
    const toastHeadingElement = document.getElementById('toastHeading');
    const toastBodyElement = document.getElementById('toastBody');

    if (toastElement && toastBodyElement && toastHeadingElement) {
      toastHeadingElement.textContent = heading;
      toastBodyElement.textContent = message;
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
    }
  }

  //clears form
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

  //Function to get formcontrol value----
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
