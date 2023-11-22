import { Component, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductService } from '../product.service';
import { Product } from '../shared/product.model';
import { v4 as uuidv4 } from 'uuid';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DeleteProductModalComponent } from '../delete-product-modal/delete-product-modal.component';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  bsModalRef: BsModalRef | undefined;
  @ViewChild('productForm') productForm!: NgForm;
  products: Product[] = [];

  public productId: string = ''
  public productName: string = '';
  public productPrice!: number;
  public productImageUrl: string = '';
  public productDescription: string = '';
  public productQuantity: number = 0;
  public productComments: string[] = [];
  public productCurrency: string = 'USD';
  public productPriceInSelectedCurrency: number = this.productPrice;

  imageLoadError: string | null = null;
  adminPassword: string = '';
  isAdminAuthenticated: boolean = false;

  constructor(private productService: ProductService, private modalService: BsModalService) {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
      },
      (error) => {
        console.error('Ошибка при загрузке товаров', error);
      }
    );
  }

  addProduct(productForm: NgForm) {
    if (productForm.valid) {
      const newProduct: Product = new Product(
        this.productName,
        this.productPrice,
        this.productImageUrl,
        this.productDescription,
        this.productQuantity,
        this.productComments,
        this.productPriceInSelectedCurrency,
        this.productCurrency,
      );


      this.productService.addProduct(newProduct).subscribe(() => {
          this.loadProducts(); // Обновить список товаров после успешного добавления
          productForm.resetForm(); // Сбросить форму
          // Очистите поля формы
          this.productName = '';
          this.productPrice;
          this.productImageUrl = '';
          this.productDescription = '';
        },
        (error) => {
          console.error('Ошибка при добавлении товара', error);
        }
      );
    }
  }

  handleImageError() {
    this.imageLoadError = 'Ошибка загрузки изображения';
    this.productImageUrl = '';
  }

  loginAdmin() {
    if (this.adminPassword === 'admin') {
      this.isAdminAuthenticated = true;
    }
  }

  deleteProduct(product: Product) {
    this.bsModalRef = this.modalService.show(DeleteProductModalComponent);
    this.bsModalRef.content.product = product;
    this.bsModalRef.content.confirmDelete.subscribe(() => {
      if (product._id) {
        this.productService.deleteProduct(product._id).subscribe(() => {
          // Удалить товар из списка
          this.products = this.products.filter(p => p._id !== product._id);
          this.bsModalRef!.hide();
        });
      }
    });
    this.bsModalRef.content.cancelDelete.subscribe(() => {
      this.bsModalRef!.hide();
    });
  }

}
