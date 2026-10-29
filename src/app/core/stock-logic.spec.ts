import { describe, expect, it } from 'vitest';
import { Vehicle } from './models';
import { attachImages, decodeAccessories, encodeAccessories, matchesSearch } from './stock-logic';

const vehicle = (id: number, overrides: Partial<Vehicle> = {}): Vehicle => ({
  id,
  manufacturer: 'Toyota',
  modelDescription: 'Corolla 1.8 XS',
  modelYear: 2021,
  colour: 'White',
  registrationNumber: 'CA 123-456',
  vin: 'JTDBR32E720123456',
  kilometreReading: 45000,
  costPrice: 250000,
  retailPrice: 289900,
  accessories: '',
  dtCreated: '2026-01-01',
  dtUpdated: '2026-01-01',
  ...overrides,
});

describe('accessories encoding', () => {
  it('reads the stored format, including data saved by the old front end', () => {
    expect(decodeAccessories('%/%Tow bar%-%Removable%/%Canopy%-%Black')).toEqual([
      { name: 'Tow bar', description: 'Removable' },
      { name: 'Canopy', description: 'Black' },
    ]);
  });

  it('handles empty values and missing descriptions', () => {
    expect(decodeAccessories('')).toEqual([]);
    expect(decodeAccessories(null)).toEqual([]);
    expect(decodeAccessories('%/%Mats')).toEqual([{ name: 'Mats', description: '' }]);
  });

  it('round-trips through encode and decode', () => {
    const accessories = [
      { name: 'Roof rack', description: 'Aluminium' },
      { name: 'Mats', description: '' },
    ];
    expect(decodeAccessories(encodeAccessories(accessories))).toEqual(accessories);
  });
});

describe('attachImages', () => {
  it('gives each vehicle its own images, in order', () => {
    const items = attachImages(
      [vehicle(1), vehicle(2), vehicle(3)],
      [
        { id: 10, stockId: 1, image: 'a' },
        { id: 11, stockId: 2, image: 'b' },
        { id: 12, stockId: 1, image: 'c' },
      ],
    );
    expect(items.map((i) => i.images)).toEqual([['a', 'c'], ['b'], []]);
  });
});

describe('matchesSearch', () => {
  const v = vehicle(1);

  it('matches make, model, year, mileage, registration and VIN, ignoring case', () => {
    for (const q of ['toyota', 'COROLLA', '2021', '45000', 'ca 123', 'jtdbr']) {
      expect(matchesSearch(v, q)).toBe(true);
    }
  });

  it('shows everything for an empty search and nothing for a miss', () => {
    expect(matchesSearch(v, '  ')).toBe(true);
    expect(matchesSearch(v, 'ford')).toBe(false);
  });
});
