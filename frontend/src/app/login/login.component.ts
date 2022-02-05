import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './login.service';
import { LoginViewModel } from '../view-models/login.view-model';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: LoginViewModel;
  constructor(private cookieService:CookieService, private loginService: LoginService, private toastr:ToastrService) { 
    this.loginForm = new LoginViewModel();
    this.loginForm.userName = 'adri';
    this.loginForm.password = '1111';
    this.loginForm.tenantName = 'Demo';
  }

  ngOnInit(): void {
  }
  async doLogin():Promise<void>{
    try{
      let response = await lastValueFrom(this.loginService.doLogin(this.loginForm.userName, this.loginForm.password, this.loginForm.tenantName));
      this.cookieService.set('jwt', response.token);
      this.cookieService.set('selectedCompany', response.defaultcompany)
      this.cookieService.set('userFullName', response.userFullName)
      this.cookieService.set('userId', response.userId + '')
      this.loginService.authState.next(true);
    }
    catch(err){
      if(err instanceof HttpErrorResponse && [401, 403].includes((err as HttpErrorResponse).status))
        this.toastr.error(err.error)
      else
        this.toastr.error('Something went wrong');
    }
  }
}
