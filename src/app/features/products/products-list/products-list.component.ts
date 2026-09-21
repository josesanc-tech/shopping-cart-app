import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.models';
import { ProductCardComponent } from '../product-card/product-card.component';

const CATEGORIES = ['Electrónica', 'Accesorios', 'Audio'];

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    ProductCardComponent
  ],
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = CATEGORIES;
  readonly searchControl = new FormControl('');
  readonly selectedCategory = signal('');
  readonly products = signal<Product[]>([]);
  readonly loading = signal(false);
  private readonly currentSearch = signal('');

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.currentSearch.set(value ?? '');
      this.fetchProducts();
    });
    this.fetchProducts();
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
    this.fetchProducts();
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.selectedCategory.set('');
    this.fetchProducts();
  }

  get hasActiveFilters(): boolean {
    return !!(this.currentSearch() || this.selectedCategory());
  }

  private fetchProducts() {
    this.loading.set(true);
    this.productService.getAll({
      search: this.currentSearch(),
      category: this.selectedCategory()
    }).subscribe({
      next: data => { this.products.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
