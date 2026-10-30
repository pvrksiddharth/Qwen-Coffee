import type { Product } from '../data/products';

export interface ProductFilters {
  search: string;
  category: string; // 'All' or one of categories
  roast: string; // 'All' or one of roastLevels
}

export const NO_FILTERS: ProductFilters = { search: '', category: 'All', roast: 'All' };

/** Case-insensitive match against name, origin and any flavor note. */
export function matchesSearch(product: Product, search: string): boolean {
  const q = search.trim().toLowerCase();
  if (!q) return true;
  return (
    product.name.toLowerCase().includes(q) ||
    product.origin.toLowerCase().includes(q) ||
    product.flavor.some((f) => f.toLowerCase().includes(q))
  );
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    const matchesCategory = filters.category === 'All' || product.category === filters.category;
    const matchesRoast = filters.roast === 'All' || product.roast === filters.roast;
    return matchesSearch(product, filters.search) && matchesCategory && matchesRoast;
  });
}
