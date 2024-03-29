import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserViewModel } from '../view-models/user.view-model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.API_URL + 'user/';
  constructor(private httpClient:HttpClient) { }
  loadUsers(pageNumber: number, search: string):Observable<any> {
    return this.httpClient.get(`${this.baseUrl}?pageNumber=${pageNumber}&search=${search}`);
  }
  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + userId)
  }
  deactivateUser(userId: number): Observable<unknown> {
    return this.httpClient.put(`${this.baseUrl}${userId}/deactivate`, {});
  }
  resetPassword(userId: number, email: string, username: string): Observable<unknown> {
    return this.httpClient.put(this.baseUrl + 'password-reset', {userId, email, username}, {responseType: 'text'})
  }
  getAllAccessPages():Observable<any>{
    return this.httpClient.get(this.baseUrl + 'all-access-pages');
  }
  getAllCategories():Observable<any>{
    return this.httpClient.get(this.baseUrl + 'all-categories');
  }
  updateUser(user: UserViewModel, selectedCompany: string):Observable<any>{
    if(selectedCompany)
      return this.httpClient.put(this.baseUrl, user, {
        params: {
          selectedCompany
        }
      });
    return this.httpClient.put(this.baseUrl, user)
  }
  createUser(user:UserViewModel):Observable<any>{
    return this.httpClient.post(this.baseUrl, user);
  }
  getUserSummary(): Observable<any> {
    return this.httpClient.get(this.baseUrl + 'summary');
  }
  loadTransSecurity(userID: number, selectedCompany: string = ''): Observable<unknown> {
    var url = this.baseUrl + userID + '/ts-details';
    if(selectedCompany)
      return this.httpClient.get(url, {
        params: {
          selectedCompany
        }
      });
    return this.httpClient.get(url);
  }
  forceLogout(userId: number):Observable<any>{
    return this.httpClient.put(`${this.baseUrl}${userId}/force-logout`, {})
  }
}
