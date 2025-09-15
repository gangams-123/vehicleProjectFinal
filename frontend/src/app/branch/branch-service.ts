import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BranchService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  private url = `${this.baseUrl}/branches`;
  createBranch(data: FormData): Observable<any> {
    return this.http.post(this.url, data);
  }
  getBranch(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(this.url, { params });
  }
  deleteBranch(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
  updateBranch(data: any): Observable<any> {
    return this.http.put(this.url, data);
  }
  getBranchFiles(id: any): Observable<any> {
    return this.http.get(`${this.url}/${id}/files`);
  }
  getFileContent(id: any): Observable<any> {
    return this.http.get(`${this.url}/file/${id}`, { responseType: 'blob' });
  }
  getBranchAddress(id: any): Observable<any> {
    return this.http.get(`${this.url}/${id}/address`);
  }
  getAllBranches(): Observable<any> {
    return this.http.get(`${this.url}/all`);
  }
}
