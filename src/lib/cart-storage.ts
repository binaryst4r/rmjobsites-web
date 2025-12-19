import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const CART_STORAGE_KEY = 'rmjobsites_cart';
const CART_COUNT_COOKIE = 'rmjobsites_cart_count';

export interface CartItem {
  productId: string;
  variationId: string;
  productName: string;
  variationName: string;
  price: number; // in cents
  quantity: number;
  imageUrl: string;
}

// LocalStorage operations
export function getCartItems(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
}

export function setCartItems(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

    // Update cookie count
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

export function clearCartStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
    clearCartCount();
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
}

// Cookie operations (for cart count badge)
export function getCartCount(): number {
  try {
    const count = cookies.get(CART_COUNT_COOKIE);
    return typeof count === 'number' ? count : parseInt(count, 10) || 0;
  } catch (error) {
    return 0;
  }
}

export function setCartCount(count: number): void {
  try {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    cookies.set(CART_COUNT_COOKIE, count, { path: '/', expires });
  } catch (error) {
    console.error('Failed to set cart count cookie:', error);
  }
}

export function clearCartCount(): void {
  try {
    cookies.remove(CART_COUNT_COOKIE, { path: '/' });
  } catch (error) {
    console.error('Failed to clear cart count cookie:', error);
  }
}
