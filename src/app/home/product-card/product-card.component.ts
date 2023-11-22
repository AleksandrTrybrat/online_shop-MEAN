import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../shared/product.model';
import { CurrencyService } from '../../currency.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {

  @Input() product: Product | undefined;
  @Input() currencySymbol: string = '$';
  @Output() productClicked: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(private currencyService: CurrencyService) {
    this.currencyService.currencyChanged.subscribe(() => {
    this.currencySymbol = this.currencyService.getCurrencySymbol();
    });
  }

  getFormattedPrice(): string {
    if (this.product) {
      return `${this.product.priceInSelectedCurrency.toFixed(0)} ${this.currencySymbol}`;
    }
    return '';
  }

  handleClick() {
    if (this.product) {
      this.productClicked.emit(this.product);
    }
  }
}
