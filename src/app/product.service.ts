import { Injectable } from '@angular/core';
import { Product } from './shared/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrencyService } from './currency.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private currencyService: CurrencyService) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products`);
  }

  // getProduct(productId: string): Observable<any> {
  //   return this.http.get<any>(`${this.baseUrl}/products/${productId}`);
  // }
  getProduct(productId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/${productId}`).pipe(
      map((product) => {
        // Устанавливаем priceInSelectedCurrency равным price
        product.priceInSelectedCurrency = product.price;
        // Устанавливаем currency валюты по умолчанию
        product.currency = this.currencyService.getCurrencySymbol();
        return product;
      })
    );
  }


  addProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/products`, product);
  }

  // Метод для удаления товара
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/products/${productId}`);
  }


  // Метод для обновления товара
  updateProduct(updatedProduct: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${updatedProduct._id}`, updatedProduct);
  }

  // метод для сохранения комментария
  saveComment(productId: string, comment: string): Observable<any> {
    const body = { comment }; // Создаем объект с комментарием
    return this.http.post<any>(`${this.baseUrl}/products/${productId}/comments`, body);
  }

   // метод для получения комментариев по ID товара
  getComments(productId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/product/${productId}`);
  }
}
