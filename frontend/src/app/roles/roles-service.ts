import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
      constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url=`${this.baseUrl}/roles`;

   getRoles(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  createRole(data:any): Observable<any> {
    return this.http.post(this.url,data);
  }
deleteRole(id: number): Observable<any> {
  return this.http.delete(`${this.url}/${id}`);
}
updateRole(data:any): Observable<any> {
    return this.http.put(this.url,data);
  }
    // Fetch all
  getAllRoles(): Observable<any> {
    return this.http.get(`${this.url}/all`);
  }
}
