import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
import {
  CartItem,
  addItem,
  cartCount,
  cartTotal,
  removeItem,
  setQuantity,
} from '../lib/cart';

const p1 = products[0]; // Ethiopian Yirgacheffe — $24.99
const p2 = products[1]; // Colombian Supremo — $21.99

describe('cart helpers', () => {
  it('addItem starts a new line with quantity 1', () => {
    const cart = addItem([], p1);
    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual({ product: p1, quantity: 1 });
  });

  it('addItem bumps quantity instead of duplicating the line', () => {
    let cart = addItem([], p1);
    cart = addItem(cart, p1);
    cart = addItem(cart, p1);
    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(3);
  });

  it('addItem keeps different products as separate lines', () => {
    const cart = addItem(addItem([], p1), p2);
    expect(cart).toHaveLength(2);
  });

  it('does not mutate the input array (immutable updates)', () => {
    const original: CartItem[] = [{ product: p1, quantity: 1 }];
    const next = addItem(original, p1);
    expect(original[0].quantity).toBe(1);
    expect(next).not.toBe(original);
  });

  it('removeItem drops only the matching product', () => {
    const cart = addItem(addItem([], p1), p2);
    const result = removeItem(cart, p1.id);
    expect(result).toHaveLength(1);
    expect(result[0].product.id).toBe(p2.id);
  });

  it('setQuantity updates the quantity in place', () => {
    const cart = addItem([], p1);
    const result = setQuantity(cart, p1.id, 5);
    expect(result[0].quantity).toBe(5);
  });

  it('setQuantity removes the line when quantity <= 0', () => {
    const cart = addItem([], p1);
    expect(setQuantity(cart, p1.id, 0)).toHaveLength(0);
    expect(setQuantity(cart, p1.id, -2)).toHaveLength(0);
  });

  it('cartTotal multiplies price by quantity across lines', () => {
    let cart = addItem([], p1);
    cart = addItem(cart, p1); // 2 × 24.99
    cart = addItem(cart, p2); // 1 × 21.99
    expect(cartTotal(cart)).toBeCloseTo(2 * 24.99 + 21.99, 5);
  });

  it('cartCount sums quantities, not lines', () => {
    let cart = addItem(addItem(addItem([], p1), p1), p2);
    expect(cart).toHaveLength(2);
    expect(cartCount(cart)).toBe(3);
  });

  it('empty cart totals are zero', () => {
    expect(cartTotal([])).toBe(0);
    expect(cartCount([])).toBe(0);
  });
});
