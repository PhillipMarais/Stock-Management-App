import { Component, Input, ViewChild } from '@angular/core';
import { Vehicle } from '../../model/vehicle';
import { DataService } from 'src/app/shared/data.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { Accessory } from 'src/app/model/accessory';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  reverse:boolean = false;
  imageSource: SafeResourceUrl;
  Accessories: Accessory[];
  AccessoryToAddName: string ='';
  AccessoryToAddDesc: string ='';

  manufacturerFilter: any;

  page: number = 1;
  tableSize: number = 3;
  tablesizes: any = [5, 10, 15, 20];
  count: number = 0;


  constructor(private sanitizer: DomSanitizer, private datePipe: DatePipe, private dataService: DataService, private fb: FormBuilder){
    this.vehicleForm = fb.group({});
    this.Accessories = [];
    this.imageSource = [];
  }

  //gets and sets data for stock
  ngOnInit() : void {
    this.dataService.getVehicles().subscribe((res: Vehicle[]) => {
      this.vehiclesToDisplay = this.vehicles = res;
      console.log(this.vehicles);
      this.dataService.getStockImages().subscribe((res) => {
      this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + res[2].image);
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
      costPrice : this.fb.control(''),
      retailPrice: this.fb.control(''),
    });
  }

  //------------Pagination------------
  onTableDataChange(event: any) {
    this.page = event;
    this.ngOnInit();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.ngOnInit();
  }

  //------------Sorting------------
  sort (key: string) {
    if(this.reverse){
      this.vehiclesToDisplay.sort((a,b) => b.manufacturer.localeCompare(a.manufacturer));
    } else
    this.vehiclesToDisplay.sort((a,b) => a.manufacturer.localeCompare(b.manufacturer));
    this.reverse = !this.reverse;
  }

  //------------Filters------------
  SearchManufacturer() {
    if(this.manufacturerFilter == ""){
      this.ngOnInit();
      this.applyOtherFilters();
    } else {
      this.vehiclesToDisplay = this.vehicles.filter(res => {
        return res.manufacturer.toLowerCase().match(this.manufacturerFilter.toLowerCase());
      });
    }
  }

  applyOtherFilters() {

  }

  //------------Buttons------------
  addStock() {
    let accesoryString ='';
    const files: FileList = this.fileInput.nativeElement.files;
    this.Accessories.forEach(accesory => {
      accesoryString = accesoryString + '%/%' + accesory.Name + '%-%' + accesory.Description;
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
      imagesArray:[],
      dtCreated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
      dtUpdated : formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
    };

    this.dataService.createVehicle(vehicle).subscribe((res) => {
      let id = (Number)(res[res.length - 1].id);
      if(files.length > 0){
        this.dataService.createStockImage(files, id).subscribe(
        response => {
        alert("new stock added");
        console.log('File uploaded successfully');
        this.vehicles = response;
        this.clearForm();
        this.closeForm.nativeElement.click();
        this.ngOnInit();
      },
      error => {
        console.error('Error uploading file:', error);
      });
      }
    },error => {
        alert('Error Adding Vehicle:' + error);
    });
  }

  accessoryToAddName(value: string){
    this.AccessoryToAddName = value;
  }

  accessoryToAddDesc(value: string){
    this.AccessoryToAddDesc = value;
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

  removeStock(event: any) {
    this.dataService.deleteVehicle(event).subscribe((res) => {
      this.dataService.deleteStockImage(event).subscribe((res) => {
        this.vehicles = res;
        this.ngOnInit();
      });
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
