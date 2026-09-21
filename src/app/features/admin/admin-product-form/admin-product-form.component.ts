import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Product } from '../../../core/models/product.models';

export interface AdminProductFormData {
  mode: 'create' | 'edit';
  product?: Product;
}

const CATEGORIES = ['Electrónica', 'Accesorios', 'Audio'];

// Validador personalizado: solo decimales con máximo 2 lugares
function maxTwoDecimalsValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === '') return null;
  const str = String(value);
  const decimalPart = str.split('.')[1];
  if (decimalPart && decimalPart.length > 2) {
    return { maxDecimals: { max: 2, actual: decimalPart.length } };
  }
  return null;
}

// Validador personalizado: el número debe ser entero
function integerValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value === null || value === '') return null;
  if (!Number.isInteger(Number(value))) {
    return { notInteger: true };
  }
  return null;
}

// Validador personalizado: SKU — solo letras, números y guiones
function skuFormatValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) return null;
  const valid = /^[a-zA-Z0-9\-_]+$/.test(value);
  return valid ? null : { skuFormat: true };
}

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <h2 mat-dialog-title style="display:flex; align-items:center; gap:8px">
      <mat-icon color="primary">{{ data.mode === 'create' ? 'add_circle' : 'edit' }}</mat-icon>
      {{ data.mode === 'create' ? 'Nuevo producto' : 'Editar producto' }}
    </h2>

    <mat-dialog-content style="min-width:460px; max-width:560px; padding-top:8px">
      <form [formGroup]="form" novalidate>

        <!-- ── Código SKU (solo en create) ─────────────────────────────── -->
        @if (data.mode === 'create') {
          <mat-form-field appearance="outline" style="width:100%; margin-bottom:4px">
            <mat-label>Código SKU *</mat-label>
            <input matInput formControlName="code"
                   placeholder="ej. PROD-007"
                   maxlength="20"
                   autocomplete="off" />
            <mat-icon matSuffix
                      [style.color]="codeCtrl.valid && codeCtrl.dirty ? '#4caf50' : '#bdbdbd'">
              {{ codeCtrl.valid && codeCtrl.dirty ? 'check_circle' : 'tag' }}
            </mat-icon>
            <mat-hint align="start">Solo letras, números y guiones. No modificable después.</mat-hint>
            <mat-hint align="end">{{ codeCtrl.value?.length ?? 0 }}/20</mat-hint>
            @if (codeCtrl.invalid && codeCtrl.touched) {
              <mat-error>
                @if (codeCtrl.errors?.['required'])   { El código SKU es obligatorio }
                @else if (codeCtrl.errors?.['minlength']) { Mínimo 2 caracteres }
                @else if (codeCtrl.errors?.['maxlength']) { Máximo 20 caracteres }
                @else if (codeCtrl.errors?.['skuFormat'])  { Solo letras, números, guiones y guiones bajos }
              </mat-error>
            }
          </mat-form-field>
        } @else {
          <mat-form-field appearance="outline" style="width:100%; margin-bottom:4px">
            <mat-label>Código SKU</mat-label>
            <input matInput [value]="data.product?.code" disabled />
            <mat-icon matSuffix style="color:#bdbdbd">lock</mat-icon>
            <mat-hint>El código no se puede modificar</mat-hint>
          </mat-form-field>
        }

        <!-- ── Nombre ───────────────────────────────────────────────────── -->
        <mat-form-field appearance="outline" style="width:100%; margin-bottom:4px">
          <mat-label>Nombre del producto *</mat-label>
          <input matInput formControlName="name"
                 placeholder="ej. Laptop Pro 15&quot;"
                 maxlength="100"
                 autocomplete="off" />
          <mat-hint align="end">{{ nameCtrl.value?.length ?? 0 }}/100</mat-hint>
          @if (nameCtrl.invalid && nameCtrl.touched) {
            <mat-error>
              @if (nameCtrl.errors?.['required'])   { El nombre es obligatorio }
              @else if (nameCtrl.errors?.['minlength']) { Mínimo 3 caracteres }
              @else if (nameCtrl.errors?.['maxlength']) { Máximo 100 caracteres }
            </mat-error>
          }
        </mat-form-field>

        <!-- ── Descripción ──────────────────────────────────────────────── -->
        <mat-form-field appearance="outline" style="width:100%; margin-bottom:4px">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="description"
                    rows="2"
                    placeholder="Breve descripción del producto"
                    maxlength="300"></textarea>
          <mat-hint align="end">{{ descCtrl.value?.length ?? 0 }}/300</mat-hint>
          @if (descCtrl.invalid && descCtrl.touched) {
            <mat-error>
              @if (descCtrl.errors?.['maxlength']) { Máximo 300 caracteres }
            </mat-error>
          }
        </mat-form-field>

        <!-- ── Categoría ────────────────────────────────────────────────── -->
        <mat-form-field appearance="outline" style="width:100%; margin-bottom:16px">
          <mat-label>Categoría *</mat-label>
          <mat-select formControlName="category">
            @for (cat of categories; track cat) {
              <mat-option [value]="cat">{{ cat }}</mat-option>
            }
          </mat-select>
          @if (catCtrl.invalid && catCtrl.touched) {
            <mat-error>Selecciona una categoría</mat-error>
          }
        </mat-form-field>

        <!-- ── Precio y Stock en fila ───────────────────────────────────── -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px">

          <mat-form-field appearance="outline">
            <mat-label>Precio (USD) *</mat-label>
            <input matInput type="number"
                   formControlName="price"
                   min="0.01" max="1000000" step="0.01"
                   placeholder="0.00" />
            <span matPrefix style="color:#616161; padding-left:4px">$&nbsp;</span>
            @if (priceCtrl.invalid && priceCtrl.touched) {
              <mat-error>
                @if (priceCtrl.errors?.['required'])    { El precio es obligatorio }
                @else if (priceCtrl.errors?.['min'])        { Debe ser mayor a 0 }
                @else if (priceCtrl.errors?.['max'])        { Máximo $1,000,000 }
                @else if (priceCtrl.errors?.['maxDecimals']) { Máximo 2 decimales }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Stock *</mat-label>
            <input matInput type="number"
                   formControlName="stock"
                   min="0" max="1000000" step="1"
                   placeholder="0" />
            <mat-icon matSuffix style="color:#9e9e9e">inventory_2</mat-icon>
            @if (stockCtrl.invalid && stockCtrl.touched) {
              <mat-error>
                @if (stockCtrl.errors?.['required'])   { El stock es obligatorio }
                @else if (stockCtrl.errors?.['min'])       { No puede ser negativo }
                @else if (stockCtrl.errors?.['max'])       { Máximo 1,000,000 unidades }
                @else if (stockCtrl.errors?.['notInteger']) { Debe ser un número entero }
              </mat-error>
            }
          </mat-form-field>

        </div>

        <!-- ── Resumen de errores si el form es inválido al enviar ─────── -->
        @if (showSummary && form.invalid) {
          <div style="background:#ffebee; border-left:4px solid #f44336; border-radius:4px;
                      padding:10px 14px; margin-top:8px; font-size:13px; color:#c62828;
                      display:flex; align-items:flex-start; gap:8px">
            <mat-icon style="font-size:18px; width:18px; height:18px; margin-top:1px">error_outline</mat-icon>
            <span>Hay campos con errores. Revísalos antes de guardar.</span>
          </div>
        }

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" style="gap:8px; padding:12px 24px 20px">
      <button mat-button (click)="cancel()">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button color="primary" (click)="submit()">
        <mat-icon>save</mat-icon>
        {{ data.mode === 'create' ? 'Crear producto' : 'Guardar cambios' }}
      </button>
    </mat-dialog-actions>
  `
})
export class AdminProductFormComponent {
  private readonly fb    = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AdminProductFormComponent>);

  readonly categories  = CATEGORIES;
  readonly form;
  showSummary = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AdminProductFormData) {
    this.form = this.fb.group({
      code: [
        data.product?.code ?? '',
        data.mode === 'create'
          ? [
              Validators.required,
              Validators.minLength(2),
              Validators.maxLength(20),
              skuFormatValidator
            ]
          : []
      ],
      name: [
        data.product?.name ?? '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
      ],
      description: [
        data.product?.description ?? '',
        [Validators.maxLength(300)]
      ],
      category: [
        data.product?.category ?? '',
        Validators.required
      ],
      price: [
        data.product?.price ?? null,
        [Validators.required, Validators.min(0.01), Validators.max(1000000), maxTwoDecimalsValidator]
      ],
      stock: [
        data.product?.stock ?? null,
        [Validators.required, Validators.min(0), Validators.max(1000000), integerValidator]
      ]
    });
  }

  // Getters para los controles — limpian el template
  get codeCtrl()  { return this.form.controls['code']; }
  get nameCtrl()  { return this.form.controls['name']; }
  get descCtrl()  { return this.form.controls['description']; }
  get catCtrl()   { return this.form.controls['category']; }
  get priceCtrl() { return this.form.controls['price']; }
  get stockCtrl() { return this.form.controls['stock']; }

  submit() {
    this.showSummary = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.dialogRef.close({
        code:        (v.code ?? '').trim().toUpperCase(),
        name:        (v.name ?? '').trim(),
        description: (v.description ?? '').trim(),
        category:    v.category ?? '',
        price:       Number(v.price),
        stock:       Math.floor(Number(v.stock))
      });
    } else {
      this.dialogRef.close({
        name:        (v.name ?? '').trim(),
        description: (v.description ?? '').trim(),
        category:    v.category ?? '',
        price:       Number(v.price),
        stock:       Math.floor(Number(v.stock))
      });
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
