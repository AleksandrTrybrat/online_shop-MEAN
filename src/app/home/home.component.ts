import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/product.model';
import { ProductService } from '../product.service';
import { PaginationInstance } from 'ngx-pagination';
import { CurrencyService } from '../currency.service';
import { UserService } from '../user.service';
import { ActivityTrackerService } from '../activity-tracker.service';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  selectedCurrencySymbol: string = '$';
  filterText: string = '';
  config: PaginationInstance = {
    itemsPerPage: 15,
    currentPage: 1,
  };
  currencySymbol: string = this.currencyService.getCurrencySymbol();
  loading: boolean = true;
  public userId: number | undefined;

  constructor(
    private productService: ProductService,
    private currencyService: CurrencyService,
    private userService: UserService,
    private activityTrackerService: ActivityTrackerService,
    private router: Router
  ) {
    this.activityTrackerService
      .getIsUserBlocked()
      .pipe(first())
      .subscribe((isUserBlocked: boolean) => {
        if (isUserBlocked) {
          this.router.navigate(['/robot-verification']);
        } else {
          this.productService.getProducts();
          this.currencyService.currencyChanged.subscribe((currencyCode) => {
            this.selectedCurrencySymbol =
              this.currencyService.getCurrencySymbol();
            this.recalculatePrices(currencyCode);
          });
          this.selectedCurrencySymbol =
            this.currencyService.getCurrencySymbol(); // Установка начального символа валюты
        }
      });
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.loading = false;
      this.updateProductPrices();
    });

    this.currencyService.currencyChanged.subscribe((currencyCode) => {
      this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
      this.recalculatePrices(currencyCode);
      this.updateProductPrices();
    });
  }

  updateProductPrices() {
    const exchangeRate = this.currencyService.getExchangeRate(
      this.currencyService.getSelectedCurrency()
    );
    this.products.forEach((product) => {
      product.priceInSelectedCurrency = product.price * exchangeRate;
    });
  }

  filterProducts() {
    this.config.currentPage = 1;
  }

  get filteredProducts(): Product[] {
    return this.products.filter((product) =>
      product.name
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(this.filterText.toLowerCase().replace(/\s/g, ''))
    );
  }

  getDisplayedPrice(product: Product): string {
    return (
      product.priceInSelectedCurrency.toFixed(0) +
      ' ' +
      this.currencyService.getCurrencySymbol()
    );
  }

  recalculatePrices(currencyCode: string) {
    const exchangeRate = this.currencyService.getExchangeRate(currencyCode);
    this.products.forEach((product) => {
      product.priceInSelectedCurrency = product.price * exchangeRate;
    });
  }

  recalculatePaginatedPrices() {
    this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
    const selectedCurrency = this.currencyService.getSelectedCurrency();
    const exchangeRate = this.currencyService.getExchangeRate(selectedCurrency);
    this.paginatedProducts.forEach((product) => {
      product.priceInSelectedCurrency = product.price * exchangeRate;
    });
  }

  onProductClick(product: Product) {
    const userId = this.userService.getUserId();
    this.activityTrackerService.logActivity('Product Click', userId);
    if (this.activityTrackerService.analyzeActivity(userId)) {
      const isUserBlocked = this.activityTrackerService.blockUser(userId);
    }
  }
}
