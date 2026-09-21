import { Injectable, inject, signal, computed, Injector, runInInjectionContext } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { CartResponse, CartItem, AddCartItemRequest } from '../models/cart.models';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly cartService = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly injector = inject(Injector);

  private readonly _cart = signal<CartResponse | null>(null);

  // Señales computadas de solo lectura
  readonly items = computed<CartItem[]>(() => this._cart()?.items ?? []);
  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly subtotal = computed(() => this._cart()?.subtotal ?? 0);
  readonly discount = computed(() => this._cart()?.discountAmount ?? 0);
  readonly total = computed(() => this._cart()?.totalAmount ?? 0);

  constructor() {
    // toObservable necesita contexto de inyección — garantizado con runInInjectionContext
    runInInjectionContext(this.injector, () => {
      toObservable(this.auth.isAuthenticated).pipe(
        distinctUntilChanged()
      ).subscribe(authenticated => {
        if (authenticated) {
          this.load();
        } else {
          this._cart.set(null);
        }
      });
    });
  }

  load() {
    this.cartService.get().subscribe({
      next: (cart) => this._cart.set(cart),
      error: () => {}
    });
  }

  addItem(productId: number, quantity: number) {
    const request: AddCartItemRequest = { productId, quantity };
    this.cartService.addItem(request).subscribe({
      next: (cart) => this._cart.set(cart),
      error: () => {}
    });
  }

  updateItem(productId: number, quantity: number) {
    this.cartService.updateItem(productId, { quantity }).subscribe({
      next: (cart) => this._cart.set(cart),
      error: () => {}
    });
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId).subscribe({
      next: () => this.load(),
      error: () => {}
    });
  }

  clear() {
    this.cartService.clear().subscribe({
      next: () => this._cart.set(null),
      error: () => {}
    });
  }
}
