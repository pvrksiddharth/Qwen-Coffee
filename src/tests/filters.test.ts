import { describe, expect, it } from 'vitest';
import { products, categories, roastLevels } from '../data/products';
import { NO_FILTERS, filterProducts, matchesSearch } from '../lib/filters';

describe('matchesSearch', () => {
  it('returns true for an empty or whitespace-only query', () => {
    expect(matchesSearch(products[0], '')).toBe(true);
    expect(matchesSearch(products[0], '   ')).toBe(true);
  });

  it('matches by name, case-insensitively', () => {
    expect(matchesSearch(products[0], 'ethiopian')).toBe(true);
    expect(matchesSearch(products[0], 'YIRGACHEFFE')).toBe(true);
  });

  it('matches by origin', () => {
    expect(matchesSearch(products[0], 'ethiopia')).toBe(true);
  });

  it('matches by any flavor note', () => {
    expect(matchesSearch(products[0], 'blueberry')).toBe(true);
    expect(matchesSearch(products[0], 'jasmine')).toBe(true);
  });

  it('rejects non-matching queries', () => {
    expect(matchesSearch(products[0], 'chocolate-lava-9000')).toBe(false);
  });
});

describe('filterProducts', () => {
  it('returns everything when no filters are active', () => {
    expect(filterProducts(products, NO_FILTERS)).toHaveLength(products.length);
  });

  it('filters by category', () => {
    const result = filterProducts(products, { ...NO_FILTERS, category: 'Single Origin' });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === 'Single Origin')).toBe(true);
  });

  it('filters by roast level', () => {
    const result = filterProducts(products, { ...NO_FILTERS, roast: 'Light' });
    expect(result.every((p) => p.roast === 'Light')).toBe(true);
  });

  it('combines search + category + roast with AND semantics', () => {
    const result = filterProducts(products, {
      search: 'caramel',
      category: 'Single Origin',
      roast: 'Medium',
    });
    for (const p of result) {
      expect(p.category).toBe('Single Origin');
      expect(p.roast).toBe('Medium');
      expect(matchesSearch(p, 'caramel')).toBe(true);
    }
  });

  it('returns an empty array when nothing matches', () => {
    const result = filterProducts(products, { ...NO_FILTERS, search: 'zzz-not-a-coffee-zzz' });
    expect(result).toEqual([]);
  });

  it('every product in the catalog is reachable via its own category & roast', () => {
    // sanity check on data integrity used by the UI chips
    for (const p of products) {
      expect(categories).toContain(p.category);
      expect(roastLevels).toContain(p.roast);
    }
  });
});
