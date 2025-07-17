import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SensorData } from '../../types/hydronia';

@Component({
  selector: 'app-growth-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './growth-data-table.component.html',
  styleUrls: ['./growth-data-table.component.scss'],
})
export class GrowthDataTableComponent implements OnInit {
  @Input() data: SensorData[] = [];
  @Input() showFilters: boolean = true;
  @Input() pageSize: number = 10;

  currentPage = 1;
  sortField: keyof SensorData = 'timestamp';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchQuery = '';

  constructor() {}

  ngOnInit(): void {}

  // Helper methods for template
  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  max(a: number, b: number): number {
    return Math.max(a, b);
  }

  get filteredData() {
    let filtered = [...this.data];

    // Search filter
    if (this.searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value
            ?.toString()
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[this.sortField] as any;
      const bValue = b[this.sortField] as any;

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  sort(field: keyof SensorData) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(field: keyof SensorData): string {
    if (this.sortField !== field) return '↕️';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getValueColor(field: keyof SensorData, value: number): string {
    switch (field) {
      case 'ph':
        if (value < 5.5 || value > 7.5) return 'text-red-600';
        if (value < 6.0 || value > 7.0) return 'text-yellow-600';
        return 'text-green-600';
      case 'ec':
        if (value < 1.0 || value > 2.5) return 'text-red-600';
        if (value < 1.5 || value > 2.0) return 'text-yellow-600';
        return 'text-green-600';
      case 'temperature':
        if (value < 20 || value > 28) return 'text-red-600';
        if (value < 22 || value > 26) return 'text-yellow-600';
        return 'text-green-600';
      case 'humidity':
        if (value < 60 || value > 80) return 'text-red-600';
        if (value < 65 || value > 75) return 'text-yellow-600';
        return 'text-green-600';
      case 'tph':
        if (value < 0.5 || value > 1.5) return 'text-red-600';
        if (value < 0.8 || value > 1.2) return 'text-yellow-600';
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  }

  exportToCSV() {
    const headers = [
      'Timestamp',
      'pH',
      'EC (mS/cm)',
      'Temperature (°C)',
      'Humidity (%)',
      'TPH',
    ];
    const csvData = this.filteredData.map((row) => [
      row.timestamp ? new Date(row.timestamp).toLocaleString() : '',
      row.ph,
      row.ec,
      row.temperature,
      row.humidity,
      row.tph,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `growth-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
