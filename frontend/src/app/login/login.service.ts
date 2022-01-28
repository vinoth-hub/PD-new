import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authState: Subject<boolean>;
  baseUrl: string = environment.API_URL;
  constructor(private httpClient: HttpClient) { 
    this.authState = new Subject();
  }
  challenge() {
    this.authState.next(false);
  }
  doLogin(username: string, password: string, tenantName: string, companyName: string): Observable<{token: string, defaultcompany: string}> {
    return this.httpClient.post<{token: string, defaultcompany: string}>(this.baseUrl + 'login', {
      username,
      password,
      tenantName,
      companyName
    })
  }
}
