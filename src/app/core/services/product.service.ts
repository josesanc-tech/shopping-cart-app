import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product, ProductFilters } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/products`;

  getAll(filters: ProductFilters = {}) {
    let params = new HttpParams();
    if (filters.search?.trim()) {
      params = params.set('search', filters.search.trim());
    }
    if (filters.category?.trim()) {
      params = params.set('category', filters.category.trim());
    }
    return this.http.get<Product[]>(this.base, { params });
  }

  getById(id: number) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
}
