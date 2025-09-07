import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl; // ✅ Dynamic base URL
  private url=`${this.baseUrl}/workFlow`;
    getWorkFlows(page: number, size: number,status:string): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('status',status);
    return this.http.get<any>(this.url, { params });
  }
  createWorkFlow(data:any): Observable<any> {
    return this.http.post(this.url,data);
  }
  getWorkFlowByModule(module:string,status:string): Observable<any>{
    return this.http.get(`${this.url}/${module}/${status}/exists`);
  }
  changeStatus(status:string,id:number): Observable<any>{
  return this.http.put(`${this.url}/${id}`, { status });
  }
}     

