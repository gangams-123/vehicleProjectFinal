import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url = `${this.baseUrl}/designations`;

  getDesignations(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  createDesignation(data: any): Observable<any> {
    return this.http.post(this.url, data);
  }
  deleteDesignation(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
  updateDesignation(id: string, data: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, data);
  }
  getDesignationByDept(id: number): Observable<any> {
    return this.http.get(`${this.url}/${id}/departments`);
  }
}
