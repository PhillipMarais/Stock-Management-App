import { Accessory, StockImage, StockItem, Vehicle } from './models';

/*
 * Pure functions for stock data, kept free of Angular and HTTP so they're easy to test.
 */

const ITEM = '%/%';
const FIELD = '%-%';

/**
 * Accessories are stored in one string column: each one is "%/%" + name + "%-%" + description.
 * This keeps the existing database format, so data saved by the old front end still reads correctly.
 */
export function decodeAccessories(encoded: string | null | undefined): Accessory[] {
  return (encoded ?? '')
    .split(ITEM)
    .filter((part) => part !== '')
    .map((part) => {
      const [name = '', description = ''] = part.split(FIELD);
      return { name, description };
    });
}

export function encodeAccessories(accessories: Accessory[]): string {
  return accessories.map((a) => `${ITEM}${a.name.trim()}${FIELD}${a.description.trim()}`).join('');
}

/** Joins each vehicle with its images. */
export function attachImages(vehicles: Vehicle[], images: StockImage[]): StockItem[] {
  const byStock = new Map<number, string[]>();
  for (const img of images) {
    const list = byStock.get(img.stockId) ?? [];
    list.push(img.image);
    byStock.set(img.stockId, list);
  }
  return vehicles.map((v) => ({ ...v, images: v.id !== undefined ? (byStock.get(v.id) ?? []) : [] }));
}

/** Free-text search across the details people search by: make, model, year, mileage, registration and VIN. */
export function matchesSearch(item: Vehicle, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [item.manufacturer, item.modelDescription, item.modelYear, item.kilometreReading, item.registrationNumber, item.vin]
    .map((value) => String(value ?? '').toLowerCase())
    .some((value) => value.includes(q));
}

/** Today's date as yyyy-MM-dd, the format the API stores. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
