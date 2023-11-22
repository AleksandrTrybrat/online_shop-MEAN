import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../shared/product.model';
import { CartService } from '../cart.service';
import { ProductService } from '../product.service';
import { CurrencyService } from '../currency.service';
import { ActivityTrackerService } from '../activity-tracker.service';
import { Subscription } from 'rxjs';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  product!: Product;
  comments: string[] = [];
  newComment: string = '';
  selectedCurrencySymbol: string = '$';
  description: string = '';
  private commentsLoaded: boolean = false;
  private activityTrackerSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private currencyService: CurrencyService,
    private activityTrackerService: ActivityTrackerService
  ) {
    this.currencyService.selectedCurrency$.subscribe((currency) => {
      // Обновляем выбранную валюту при ее изменении
      this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
      this.updateProductPriceInSelectedCurrency();
    });
  }

  ngOnInit(): void {
    this.currencyService.currencyChanged.subscribe(() => {
      this.selectedCurrencySymbol = this.currencyService.getCurrencySymbol();
      this.updateProductPriceInSelectedCurrency();
    });

    this.activityTrackerSubscription = this.activityTrackerService
      .getIsUserBlocked()
      //
      .pipe(first())
      //
      .subscribe((isUserBlocked) => {
        if (isUserBlocked) {
          this.router.navigate(['/robot-verification']);
        } else {
          this.route.paramMap.subscribe((params) => {
            const productId = params.get('id');
            const selectedCurrency = params.get('currency');
            if (productId !== null) {
              const parsedProductId = productId;
              this.productService
                .getProduct(parsedProductId)
                .subscribe((product) => {
                  this.product = product;
                  this.updateProductPriceInSelectedCurrency();
                  if (this.product && !this.commentsLoaded) {
                    this.loadCommentsFromDatabase();
                    this.commentsLoaded = true;
                  }
                  // if (selectedCurrency) {
                  //           this.currencyService.setSelectedCurrency(selectedCurrency); // Устанавливаем выбранную валюту
                  //           this.updateProductPriceInSelectedCurrency();
                  //   }
                });
            }
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.activityTrackerSubscription) {
      this.activityTrackerSubscription.unsubscribe();
    }
  }

  updateProductPriceInSelectedCurrency(): void {
    if (this.product) {
      const selectedCurrency = this.currencyService.getSelectedCurrency();
      const exchangeRate =
        this.currencyService.getExchangeRate(selectedCurrency);
      this.product.priceInSelectedCurrency = this.product.price * exchangeRate;
    }
  }

  addComment() {
    if (this.newComment.trim() !== '') {
      const sanitizedComment = this.sanitizeComment(this.newComment);
      if (this.product) {
        if (!this.product.comments) {
          this.product.comments = [];
        }
        this.product.comments.push(sanitizedComment);

        // Обновление комментариев внутри клиентского кода
        this.comments = this.product.comments.slice();

        // Отправить комментарий на сервер для сохранения
        this.productService.updateProduct(this.product).subscribe(() => {
          console.log('Комментарий сохранен в базе данных:', sanitizedComment);
          console.log(
            'Комментарии внутри this.product после добавления:',
            this.product.comments
          );
        });
      }
      this.newComment = '';
    }
  }

  loadCommentsFromDatabase() {
    if (this.product && this.product._id) {
      this.productService
        .getComments(this.product._id)
        .subscribe((comments: string[]) => {
          this.comments = comments;
          console.log('Загруженные комментарии из базы данных:', this.comments);
        });
    }
    this.commentsLoaded = true;
  }

  addProductToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  sanitizeComment(comment: string): string {
    let replacedCount = 0;
    comment = comment.replace(/кокос|банан|плохой|@/gi, (match) => {
      replacedCount += match.length;
      return '*'.repeat(match.length);
    });

    return comment;
  }

  getFormattedPrice(price: number): string {
    return this.currencyService.getFormattedPrice(price);
  }
}
