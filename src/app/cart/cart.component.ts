import { CartInfoService } from '../cart-info.service';
import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../shared/product.model';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  cartItems: Product[] = [];
  selectedCurrencySymbol: string = '$';
  totalOrderPrice: number = 0;
  cartItemCount: number = 0;

  constructor(
    private cartService: CartService,
    private cartInfoService: CartInfoService,
    private currencyService: CurrencyService
  ) {
    this.currencyService.currencyChanged.subscribe(() => {
      this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
      this.calculateTotalOrderPrice();
    });
  }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItemsFromLocalStorage();
    this.cartService.updateCartItemCount();
    this.calculateTotalOrderPrice();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  removeFromCart(product: Product) {
    this.cartService.removeItemFromCart(product);
    this.cartItemCount = this.cartService.getCartItemCount();
    this.calculateTotalOrderPrice();
    this.cartItems = this.cartService.getCartItems();
  }

  calculateItemTotal(item: Product): number {
    return item.price * item.quantity;
  }

  calculateTotalOrderPrice() {
    this.totalOrderPrice = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  incrementQuantity(product: Product) {
    product.quantity += 1;
    this.calculateTotalOrderPrice();
    this.cartService.updateCartItemCount();
  }

  decrementQuantity(product: Product) {
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      this.removeFromCart(product);
    }
    this.calculateTotalOrderPrice();
    this.cartService.updateCartItemCount();
  }

  formatTotalPrice(price: number, currencySymbol: string): string {
    return price.toFixed(2) + ' ' + currencySymbol;
  }

  getFormattedPrice(price: number): string {
    return this.currencyService.getFormattedPrice(price);
  }

  customerFirsName = '';
  customerSecondName = '';
  customerPatronymic = '';
  customerEmail = '';
  customerPhoneNumber = '';

  isSuccessModalOpen: boolean = false;


  checkout() {
    // Передача информации о покупке и покупателе в метод отправки в Telegram
    this.sendPurchaseInfoToTelegram();
    // Очистка корзины и сброс информации о покупателе после оформления заказа
    this.cartService.clearCart();
    this.cartItems = [];
    this.calculateTotalOrderPrice();
    this.cartService.clearCartLocalStorage();
    this.cartItemCount = 0;
    this.cartService.updateCartItemCount();
    this.customerFirsName = '';
    this.customerSecondName = '';
    this.customerPatronymic = '';
    this.customerEmail = '';
    this.customerPhoneNumber = '';

    this.isSuccessModalOpen = true;

    // Автоматическое закрытие модального окна через 3 секунды
    setTimeout(() => {
      this.isSuccessModalOpen = false;
    }, 3000);
  }

  // отправка информации о покупке в Telegram
  sendPurchaseInfoToTelegram() {
    const currencySymbol = this.currencyService.getCurrencySymbol();
    // Текст сообщения для отправки в Telegram, включая информацию о покупке и покупателе
    const purchaseInfo = `
      Покупатель:
      ${this.customerFirsName} ${this.customerSecondName} ${this.customerPatronymic}
      Электронная почта: ${this.customerEmail}
      Номер телефона: ${this.customerPhoneNumber}
      Заказанные товары:
      ${this.cartItems
        .map((item) => `${item.name} (Количество: ${item.quantity})`)
        .join('\n')}
      Общая сумма заказа: ${this.formatTotalPrice(
        this.totalOrderPrice,
        currencySymbol
      )}
    `;

    // Отправка сообщение в Telegram
    this.cartInfoService.sendMessage(purchaseInfo).subscribe(
      () => {
        // Успешная отправка
        console.log('Сообщение успешно отправлено в Telegram');
      },
      (error) => {
        // Ошибка отправки
        console.error('Ошибка отправки сообщения в Telegram:', error);
      }
    );
  }

}
