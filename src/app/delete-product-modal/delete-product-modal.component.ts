import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductService } from '../product.service';
import { Product } from '../shared/product.model';


@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css']

})
export class DeleteProductModalComponent {
  product?: Product;
  public confirmDelete: EventEmitter<void> = new EventEmitter<void>();
  public cancelDelete: EventEmitter<void> = new EventEmitter<void>();
  constructor(public bsModalRef: BsModalRef, private productService: ProductService) {
  }

  confirmDeleteAction() {
    this.bsModalRef.hide();
      this.confirmDelete.emit();
  }

  cancelDeleteAction() {
    this.bsModalRef.hide();
    this.cancelDelete.emit();
  }
}
