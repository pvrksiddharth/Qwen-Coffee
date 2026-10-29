import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

/** Add one unit of a product (or bump the existing line's quantity). */
export function addItem(cart: CartItem[], product: Product): CartItem[] {
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  return [...cart, { product, quantity: 1 }];
}

export function removeItem(cart: CartItem[], productId: number): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}

/** Set an exact quantity; quantities <= 0 remove the line entirely. */
export function setQuantity(cart: CartItem[], productId: number, quantity: number): CartItem[] {
  if (quantity <= 0) return removeItem(cart, productId);
  return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
}

export function cartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
