import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../../core/models/product.models';
import { CartStore } from '../../../core/stores/cart.store';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private readonly cartStore = inject(CartStore);
  private readonly toast = inject(ToastService);

  readonly adding = signal(false);

  get stockStatus(): 'out' | 'low' | 'ok' {
    if (this.product.stock === 0) return 'out';
    if (this.product.stock < 10) return 'low';
    return 'ok';
  }

  addToCart() {
    if (this.product.stock === 0 || this.adding()) return;
    this.adding.set(true);
    this.cartStore.addItem(this.product.id, 1);
    this.toast.success(`"${this.product.name}" agregado al carrito`);
    setTimeout(() => this.adding.set(false), 800);
  }
}
