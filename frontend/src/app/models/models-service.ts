import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class ModelsService {
   constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url=`${this.baseUrl}/models`;

   getModel(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  createModel(data:any): Observable<any> {
    return this.http.post(this.url,data);
  }
deleteModel(id: number): Observable<any> {
  return this.http.delete(`${this.url}/${id}`);
}
updateModel(data:any): Observable<any> {
    return this.http.put(this.url,data);
  }
}


