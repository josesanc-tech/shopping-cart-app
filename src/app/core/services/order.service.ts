import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/orders`;

  create() {
    return this.http.post<Order>(this.base, {});
  }

  getHistory() {
    return this.http.get<Order[]>(this.base);
  }

  getById(id: number) {
    return this.http.get<Order>(`${this.base}/${id}`);
  }
}
