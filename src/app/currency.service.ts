import { Injectable, EventEmitter  } from '@angular/core';
import { Product } from './shared/product.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  selectedCurrency: string = 'USD';
  currencySymbol: string = '$';
  private exchangeRates: { [currency: string]: number } = {
    USD: 1,
    EUR: 0.91,
    GBP: 0.84,
  };
  currencyChanged: EventEmitter<string> = new EventEmitter<string>();

  private selectedCurrencySubject = new BehaviorSubject<string>(this.selectedCurrency);
  selectedCurrency$ = this.selectedCurrencySubject.asObservable();

  constructor(private http: HttpClient) {
    const selectedCurrency = localStorage.getItem('selectedCurrency');
    if (selectedCurrency) {
      this.selectedCurrency = selectedCurrency;
      this.currencySymbol = this.getCurrencySymbolForCurrency(selectedCurrency);
      this.selectedCurrencySubject.next(selectedCurrency);
    }
    // const selectedCurrency = localStorage.getItem('selectedCurrency');
    // if (selectedCurrency) {
    //   this.selectedCurrency = selectedCurrency;
    // }
  }


  recalculatePrices(products: Product[]): void {
    products.forEach((product) => {
      const exchangeRate = this.getExchangeRate(this.getSelectedCurrency());
      product.priceInSelectedCurrency = product.price * exchangeRate;
    });
  }

  getSelectedCurrency(): string {
    return this.selectedCurrency;
  }

  setSelectedCurrency(currencyCode: string): void {
    if (this.selectedCurrency !== currencyCode) {
      this.selectedCurrency = currencyCode;
      this.currencySymbol = this.getCurrencySymbolForCurrency(currencyCode);
      this.currencyChanged.emit(currencyCode);
      this.selectedCurrencySubject.next(currencyCode);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  }


  getExchangeRate(currency: string): number {
    return this.exchangeRates[currency] || 1;
  }

  getCurrencySymbol(): string {
    return this.selectedCurrency;
  }

  private getCurrencySymbolForCurrency(currencyCode: string): string {
    const currencySymbols: { [currency: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
    };
    return currencySymbols[currencyCode] || '$'; // По умолчанию, если символ не найден
  }

  getFormattedPrice(price: number): string {
    const selectedCurrency = this.getSelectedCurrency();
    const exchangeRate = this.getExchangeRate(selectedCurrency);
    const priceInSelectedCurrency = price * exchangeRate;

    return priceInSelectedCurrency.toFixed(0) + ' ' + this.getCurrencySymbol();
  }

}

