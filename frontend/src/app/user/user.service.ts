import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = environment.API_URL;
  constructor(private httpClient:HttpClient) { }
  loadUsers(pageNumber: number):Observable<any> {
    return this.httpClient.get(this.baseUrl + 'users?pageNumber=' + pageNumber)
  }
}
