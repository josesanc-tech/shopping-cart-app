import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string) {
    this.show(message, 'snack-success', 3000);
  }

  error(message: string) {
    this.show(message, 'snack-error', 4000);
  }

  warning(message: string) {
    this.show(message, 'snack-warning', 3500);
  }

  info(message: string) {
    this.show(message, 'snack-info', 3000);
  }

  private show(message: string, panelClass: string, duration: number) {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
