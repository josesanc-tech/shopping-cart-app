import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.models';
import { CreateProductRequest, UpdateProductRequest } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  create(request: CreateProductRequest) {
    return this.http.post<Product>(this.base, request);
  }

  update(id: number, request: UpdateProductRequest) {
    return this.http.put<Product>(`${this.base}/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
