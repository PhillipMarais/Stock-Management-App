import { Bytes } from "@angular/fire/firestore";
import { Accessory } from "./accessory";

export class Vehicle {
    id?: number = 0;
    modelYear : number = 0;
    modelDescription ='';
    manufacturer ='';
    colour ='';
    registrationNumber='';
    vin ='';
    kilometreReading : number = 0;
    retailPrice : number = 0;
    costPrice  : number = 0;
    imagesArray: string[]=[];
    accessories = '';
    dtCreated = '';
    dtUpdated = '';
}
