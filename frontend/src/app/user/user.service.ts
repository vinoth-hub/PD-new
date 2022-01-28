import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.API_URL + 'user/';
  constructor(private httpClient:HttpClient) { }
  loadUsers(pageNumber: number):Observable<any> {
    return this.httpClient.get(this.baseUrl + 'users?pageNumber=' + pageNumber)
  }
  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + userId)
  }
  deactivateUser(userId: number): Observable<unknown> {
    return this.httpClient.put(`${this.baseUrl}${userId}/deactivate`, {});
  }
  resetPassword(userId: number, email: string): Observable<unknown> {
    return this.httpClient.put(this.baseUrl + 'password-reset', {userId, email}, {responseType: 'text'})
  }
}
