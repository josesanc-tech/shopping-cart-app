import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartStore } from '../../../core/stores/cart.store';
import { CartItem } from '../../../core/models/cart.models';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './cart-summary.component.html'
})
export class CartSummaryComponent {
  readonly cartStore = inject(CartStore);
  readonly displayedColumns = ['product', 'price', 'quantity', 'subtotal', 'actions'];

  increment(item: CartItem) {
    this.cartStore.updateItem(item.productId, item.quantity + 1);
  }

  decrement(item: CartItem) {
    if (item.quantity <= 1) this.cartStore.removeItem(item.productId);
    else this.cartStore.updateItem(item.productId, item.quantity - 1);
  }

  remove(item: CartItem) {
    this.cartStore.removeItem(item.productId);
  }
}
