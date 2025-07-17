import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SensorData, PlantImage } from '../types/hydronia';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getSensorReadings(row: number, cycle: number): Observable<SensorData[]> {
    return this.http.get<SensorData[]>(
      `${this.baseUrl}/sensors/${row}/${cycle}/`
    );
  }

  getPlantImages(row: number, cycle: number): Observable<PlantImage[]> {
    return this.http.get<PlantImage[]>(
      `${this.baseUrl}/images/${row}/${cycle}/`
    );
  }

  getManualLogs(row: number, cycle: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/logs/${row}/${cycle}/`);
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/profile/`);
  }
}
