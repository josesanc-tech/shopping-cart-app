import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../core/services/product.service';
import { AdminProductService } from '../../../core/services/admin-product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.models';
import { AdminProductFormComponent, AdminProductFormData } from '../admin-product-form/admin-product-form.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly adminService = inject(AdminProductService);
  private readonly toast = inject(ToastService);
  private readonly dialog = inject(MatDialog);

  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = ['code', 'name', 'category', 'price', 'stock', 'actions'];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getAll().subscribe({
      next: data => { this.products.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreateDialog() {
    const ref = this.dialog.open(AdminProductFormComponent, {
      width: '520px',
      disableClose: true,
      data: { mode: 'create' } as AdminProductFormData
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.adminService.create(result).subscribe({
        next: () => {
          this.toast.success('Producto creado correctamente');
          this.loadProducts();
        }
      });
    });
  }

  openEditDialog(product: Product) {
    const ref = this.dialog.open(AdminProductFormComponent, {
      width: '520px',
      disableClose: true,
      data: { mode: 'edit', product } as AdminProductFormData
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.adminService.update(product.id, result).subscribe({
        next: () => {
          this.toast.success('Producto actualizado correctamente');
          this.loadProducts();
        }
      });
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;

    this.adminService.delete(product.id).subscribe({
      next: () => {
        this.toast.success(`"${product.name}" eliminado`);
        this.loadProducts();
      }
    });
  }

  stockClass(stock: number): string {
    if (stock === 0)  return 'stock-chip-out';
    if (stock < 10)   return 'stock-chip-low';
    return 'stock-chip-ok';
  }
}
