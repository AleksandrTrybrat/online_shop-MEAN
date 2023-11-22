import { Component} from '@angular/core';
import { CartService } from '../cart.service';


@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.css']
})
export class CartIconComponent {

  cartItemCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItemCount = this.cartService.getCartItemCount();

    this.cartService.itemAdded.subscribe(() => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });

    this.cartService.cartItemCountUpdated.subscribe((count) => {
      this.cartItemCount = count;
    });

    this.cartService.getCartItemsFromLocalStorage();
  }
}
