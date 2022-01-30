import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authState: Subject<boolean>;
  baseUrl: string = environment.API_URL;
  accessDenied: Subject<boolean>;
  constructor(private httpClient: HttpClient, private cookieService:CookieService) { 
    this.authState = new Subject();
    this.accessDenied = new Subject();
  }
  challenge() {
    this.cookieService.delete('jwt');
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
