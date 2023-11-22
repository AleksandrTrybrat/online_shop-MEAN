import { Component } from '@angular/core';
import { CurrencySelection } from '../shared/currency-selection';
import { CurrencyService } from '../currency.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-currency-selection',
  templateUrl: './currency-selection.component.html',
})

export class CurrencySelectionComponent {
  productId!: string | null;

  currencies: CurrencySelection[] = [
    new CurrencySelection('USD', '$'), // USD
    new CurrencySelection('EUR', '€'), // EUR
    new CurrencySelection('GBP', '£'), // GBP
  ];

  constructor(public currencyService: CurrencyService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
  }

  selectCurrency(currencyCode: string) {
    this.currencyService.setSelectedCurrency(currencyCode);
  }

  setCurrency(currencyCode: string) {
    this.currencyService.setSelectedCurrency(currencyCode);
  }
}




