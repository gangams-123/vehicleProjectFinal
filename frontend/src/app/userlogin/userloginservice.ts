import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url = `${this.baseUrl}/login`;

  checkLogin(data: any): Observable<any> {
    return this.http.post(this.url, data);
  }
}
