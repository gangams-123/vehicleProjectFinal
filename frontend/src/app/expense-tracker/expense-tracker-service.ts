import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseTrackerService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.apiUrl;
  private url = `${this.baseUrl}/expenses`;
  createExpense(data: FormData): Observable<any> {
    return this.http.post(this.url, data);
  }
  getExpensesForApproval(roleId: string, deptId: string): Observable<any> {
    return this.http.get(`${this.url}/${roleId}/${deptId}`);
  }
  updateExpense(data: any): Observable<any> {
    return this.http.put(this.url, data);
  }
}
