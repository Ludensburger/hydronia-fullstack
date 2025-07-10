import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health-status-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-status-indicator.component.html',
  styleUrls: ['./health-status-indicator.component.scss'],
})
export class HealthStatusIndicatorComponent implements OnInit {
  @Input() healthScore: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showDetails: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  get healthStatus() {
    if (this.healthScore >= 90) return 'excellent';
    if (this.healthScore >= 75) return 'good';
    if (this.healthScore >= 50) return 'moderate';
    return 'poor';
  }

  get statusColor() {
    switch (this.healthStatus) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  get statusBgColor() {
    switch (this.healthStatus) {
      case 'excellent':
        return 'bg-green-100 border-green-300';
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'moderate':
        return 'bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  get statusIcon() {
    switch (this.healthStatus) {
      case 'excellent':
        return '🌟';
      case 'good':
        return '✅';
      case 'moderate':
        return '⚠️';
      case 'poor':
        return '❌';
      default:
        return '❓';
    }
  }

  get statusText() {
    switch (this.healthStatus) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'moderate':
        return 'Moderate';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  }

  get circleSize() {
    switch (this.size) {
      case 'sm':
        return 'w-16 h-16';
      case 'md':
        return 'w-24 h-24';
      case 'lg':
        return 'w-32 h-32';
      default:
        return 'w-24 h-24';
    }
  }

  get strokeWidth() {
    switch (this.size) {
      case 'sm':
        return 6;
      case 'md':
        return 8;
      case 'lg':
        return 10;
      default:
        return 8;
    }
  }

  get radius() {
    switch (this.size) {
      case 'sm':
        return 26;
      case 'md':
        return 40;
      case 'lg':
        return 54;
      default:
        return 40;
    }
  }

  get circumference() {
    return 2 * Math.PI * this.radius;
  }

  get strokeDasharray() {
    const progress = (this.healthScore / 100) * this.circumference;
    return `${progress} ${this.circumference}`;
  }

  get strokeColor() {
    switch (this.healthStatus) {
      case 'excellent':
        return '#16a34a';
      case 'good':
        return '#22c55e';
      case 'moderate':
        return '#eab308';
      case 'poor':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  }
}
