export interface SensorData {
  pH: number;
  ec: number;
  temperature: number;
  humidity: number;
  tph: number;
  timestamp?: Date;
}

export interface Alert {
  id: string;
  type: 'sensor' | 'prediction' | 'system';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface Prediction {
  type: 'nutrient_depletion' | 'fungal_risk' | 'pest_risk' | 'growth_forecast';
  timeframe: string;
  confidence: number;
  description: string;
  recommendations: string[];
}

export interface SystemHealth {
  deviceConnectivity: Record<string, boolean>;
  dataIngestionRate: number;
  lastDataReceived: Date;
  storageUsage: number;
  apiStatus: 'healthy' | 'degraded' | 'down';
}

export interface AIModel {
  name: string;
  version: string;
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'inactive';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'admin';
  lastLogin: string;
  active: boolean;
}

export interface CropCycle {
  id: string;
  name: string;
  startDate: Date;
  expectedHarvestDate: Date;
  currentDay: number;
  totalDays: number;
  status: 'active' | 'completed' | 'failed';
}

export interface PlantImage {
  id: string;
  url: string;
  capturedAt: Date;
  rowNumber: number;
  analysisResults?: {
    healthScore: number;
    detectedConditions: string[];
    recommendations: string[];
  };
}
