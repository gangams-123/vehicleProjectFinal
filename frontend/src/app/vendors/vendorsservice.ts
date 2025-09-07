import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Vendorsservice {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url=`${this.baseUrl}/vendors`;
    getVendors(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  createVendors(data:any): Observable<any> {
    return this.http.post(this.url,data);
  }
  getVendorAddresses(id:any): Observable<any> {
     return this.http.get(`${this.url}/${id}/addresses`);
  }
}     
