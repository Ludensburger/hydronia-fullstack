import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlantImage } from '../../types/hydronia';

@Component({
  selector: 'app-plant-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plant-gallery.component.html',
  styleUrls: ['./plant-gallery.component.scss'],
})
export class PlantGalleryComponent {
  currentImageIndex = 0;
  sliderValue = 50;
  isFullscreen = false;

  // Mock data for demonstration
  plantImages: PlantImage[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop',
      capturedAt: new Date(),
      rowNumber: 1,
      analysisResults: {
        healthScore: 85,
        detectedConditions: ['Healthy Growth', 'Optimal Hydration'],
        recommendations: [
          'Continue current nutrient schedule',
          'Monitor pH levels',
        ],
      },
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop',
      capturedAt: new Date(Date.now() - 86400000), // 1 day ago
      rowNumber: 2,
      analysisResults: {
        healthScore: 92,
        detectedConditions: ['Excellent Growth', 'Perfect Nutrient Uptake'],
        recommendations: [
          'Maintain current conditions',
          'Prepare for harvest soon',
        ],
      },
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1574685286019-0cb7c2c6f5d3?w=400&h=300&fit=crop',
      capturedAt: new Date(Date.now() - 172800000), // 2 days ago
      rowNumber: 3,
      analysisResults: {
        healthScore: 78,
        detectedConditions: ['Minor Nutrient Deficiency', 'Slight Wilting'],
        recommendations: [
          'Increase nitrogen levels',
          'Check water temperature',
        ],
      },
    },
  ];

  beforeImage =
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=300&fit=crop';
  afterImage =
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop';

  constructor(private router: Router) {}

  get currentImage() {
    return this.plantImages[this.currentImageIndex];
  }

  previousImage() {
    this.currentImageIndex =
      this.currentImageIndex > 0
        ? this.currentImageIndex - 1
        : this.plantImages.length - 1;
  }

  nextImage() {
    this.currentImageIndex =
      this.currentImageIndex < this.plantImages.length - 1
        ? this.currentImageIndex + 1
        : 0;
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  downloadImage() {
    // Implementation for downloading image
    console.log('Downloading image:', this.currentImage.url);
  }

  onSliderChange(event: any) {
    this.sliderValue = event.target.value;
  }

  goBack() {
    this.router.navigate(['/farmer-dashboard']);
  }

  getHealthScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  }

  getHealthScoreBadgeColor(score: number): string {
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-300';
    if (score >= 75) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  }
}
