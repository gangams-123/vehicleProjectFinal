import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url = `${this.baseUrl}/bankAccounts`;
  getAccounts(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  createAccount(data: FormData): Observable<any> {
    return this.http.post(this.url, data);
  }
  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
  updateAccount(data: any): Observable<any> {
    return this.http.put(this.url, data);
  }
  getAccountFiles(id: any): Observable<any> {
    return this.http.get(`${this.url}/${id}/files`);
  }
  getFileContent(id: any): Observable<any> {
    return this.http.get(`${this.url}/file/${id}`, { responseType: 'blob' });
  }
}
