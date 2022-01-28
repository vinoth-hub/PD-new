import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { AppService } from './app.service';
import { LoginService } from './login/login.service';
import { Company } from './view-models/company.view-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pd';
  jwt:string = '';
  selectedCompany: string | undefined = '';
  companies:Company[] = [];
  authState: boolean = false;
  constructor(private loginService:LoginService, private router:Router, private cookieService:CookieService, private appService:AppService){
    this.loginService.authState.subscribe((state:boolean) => {
      if(!state)
        this.router.navigate(['/login']);
      else
        this.router.navigate(['/user'])
      this.authState = state;
    })
  }
  async ngOnInit(): Promise<void> {
    this.jwt = this.cookieService.get('jwt')
    if(!this.jwt)
      this.loginService.challenge();
    else{
      await this.fillCompanyDropdown();
      this.selectedCompany = sessionStorage.getItem('selectedCompany') as string;
      this.loginService.authState.next(true);
    }
      
  }
  async fillCompanyDropdown(): Promise<void> {
    this.companies = await lastValueFrom(this.appService.getCompanyList());
  }
  companyChanged():void{
    sessionStorage.setItem('selectedCompany', this.selectedCompany as string);
    window.location.reload();
  }
}
