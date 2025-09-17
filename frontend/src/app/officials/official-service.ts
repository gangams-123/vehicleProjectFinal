import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OfficialService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  private url = `${this.baseUrl}/officials`;
  createOfficial(data: FormData): Observable<any> {
    return this.http.post(this.url, data);
  }
  getOfficials(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  deleteOfficial(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
  checkEmailExists(email: string): Observable<any> {
    const encodedEmail = encodeURIComponent(email);
    return this.http.get(`${this.url}/email/${encodedEmail}`);
  }
}
