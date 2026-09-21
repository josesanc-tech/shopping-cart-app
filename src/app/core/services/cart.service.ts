import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CartResponse,
  AddCartItemRequest,
  UpdateCartItemRequest
} from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/cart`;

  get() {
    return this.http.get<CartResponse>(this.base);
  }

  addItem(request: AddCartItemRequest) {
    return this.http.post<CartResponse>(`${this.base}/items`, request);
  }

  updateItem(productId: number, request: UpdateCartItemRequest) {
    return this.http.put<CartResponse>(`${this.base}/items/${productId}`, request);
  }

  removeItem(productId: number) {
    return this.http.delete<void>(`${this.base}/items/${productId}`);
  }

  clear() {
    return this.http.delete<void>(this.base);
  }
}
