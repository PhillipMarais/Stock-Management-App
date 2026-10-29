/** A vehicle as the API stores it (camelCase JSON from the ASP.NET Core API). */
export interface Vehicle {
  id?: number;
  manufacturer: string;
  modelDescription: string;
  modelYear: number;
  colour: string;
  registrationNumber: string;
  vin: string;
  kilometreReading: number;
  costPrice: number;
  retailPrice: number;
  /** Accessories encoded as a single string; see accessories.ts. */
  accessories: string;
  dtCreated: string;
  dtUpdated: string;
}

/** A row from GET /api/StockImages: one image of one vehicle, base64-encoded. */
export interface StockImage {
  id: number;
  stockId: number;
  image: string;
}

/** A vehicle together with its images, as the UI uses it. */
export interface StockItem extends Vehicle {
  images: string[];
}

export interface Accessory {
  name: string;
  description: string;
}
