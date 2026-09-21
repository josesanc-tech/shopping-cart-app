import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center gap-3"
      [class.py-24]="fullPage"
      role="status"
      [attr.aria-label]="label"
    >
      <svg
        class="animate-spin text-indigo-600"
        [class]="sizeClass"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      @if (label && showLabel) {
        <p class="text-sm text-gray-500 font-medium">{{ label }}</p>
      }
    </div>
  `
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullPage = false;
  @Input() label = 'Cargando...';
  @Input() showLabel = false;

  get sizeClass(): string {
    return { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }[this.size];
  }
}
