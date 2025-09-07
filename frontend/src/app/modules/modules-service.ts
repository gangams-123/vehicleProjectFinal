import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
    constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url=`${this.baseUrl}/modules`;

   getmodules(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  createModule(data:any): Observable<any> {
    return this.http.post(this.url,data);
  }
deleteModule(id: number): Observable<any> {
  return this.http.delete(`${this.url}/${id}`);
}
updateModule(data:any): Observable<any> {
    return this.http.put(this.url,data);
  }
    // Fetch all
  getAllModulles(): Observable<any> {
    return this.http.get(`${this.url}/all`);
  }

}
