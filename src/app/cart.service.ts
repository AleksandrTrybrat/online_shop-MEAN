import { Injectable, EventEmitter } from '@angular/core';
import { Product } from './shared/product.model';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: Product[] = [];
  private cartItemCount: number = 0;
  itemAdded: EventEmitter<void> = new EventEmitter<void>();
  cartItemCountUpdated: EventEmitter<number> = new EventEmitter<number>();


  addToCart(product: Product) {
    const existingProduct = this.cartItems.find(item => item._id === product._id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      this.cartItems.push(product);
    }
    this.saveCartItemsToLocalStorage();
    this.updateCartItemCount();

      // Сохранение обновленной корзины в localStorage
  this.saveCartItemsToLocalStorage();
  this.updateCartItemCount();
  }

  private saveCartItemsToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  console.log('Сохранено в localStorage:', this.cartItems);
  }

  removeItemFromCart(product: Product) {
    const index = this.cartItems.findIndex(item => item._id === product._id);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.saveCartItemsToLocalStorage();
      this.updateCartItemCount();
    }
  }

  clearCart() {
    this.cartItems = [];
    this.cartItemCount = 0;
  }

  getCartItemCount(): number {
    return this.cartItemCount;
  }

  getCartItems(): Product[] {
    return this.cartItems;
  }

  getCartItemsFromLocalStorage(): Product[] {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
      this.updateCartItemCount();
    return this.cartItems;
    }
    return [];
  }

  clearCartLocalStorage() {
    localStorage.removeItem('cartItems');
    console.log('Удалено из localStorage');
  }

  updateCartItemCount() {
    this.cartItemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
    this.itemAdded.emit();
    this.cartItemCountUpdated.emit(this.cartItemCount);
    this.saveCartItemsToLocalStorage();
 }
}
