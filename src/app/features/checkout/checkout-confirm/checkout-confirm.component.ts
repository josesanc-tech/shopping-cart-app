import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartStore } from '../../../core/stores/cart.store';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-checkout-confirm',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout-confirm.component.html'
})
export class CheckoutConfirmComponent {
  readonly cartStore = inject(CartStore);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly loading = signal(false);

  confirm() {
    if (this.loading() || this.cartStore.items().length === 0) return;
    this.loading.set(true);
    this.orderService.create().subscribe({
      next: () => {
        this.toast.success('¡Compra realizada con éxito! 🎉');
        this.cartStore.clear();
        this.router.navigate(['/orders']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 400) this.router.navigate(['/products']);
      }
    });
  }
}
