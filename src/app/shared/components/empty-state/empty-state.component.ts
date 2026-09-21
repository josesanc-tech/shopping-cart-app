import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center py-24 text-center" role="status">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
           [class]="iconBgClass">
        <ng-content select="[icon]">
          <!-- default icon -->
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
        </ng-content>
      </div>
      <h3 class="text-base font-semibold text-gray-900 mb-1">{{ title }}</h3>
      @if (description) {
        <p class="text-sm text-gray-500 max-w-xs">{{ description }}</p>
      }
      @if (actionLabel && actionRoute) {
        <a [routerLink]="actionRoute"
           class="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          {{ actionLabel }}
        </a>
      }
      @if (actionLabel && !actionRoute) {
        <button
          (click)="action.emit()"
          class="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          {{ actionLabel }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() actionLabel?: string;
  @Input() actionRoute?: string;
  @Input() iconBgClass = 'bg-gray-100';
  @Output() action = new EventEmitter<void>();
}
