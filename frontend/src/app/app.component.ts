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
  selectedCompany: string = '';
  companies:Company[] = [];
  authState: boolean = false;
  accessDenied: boolean = false;
  constructor(private loginService:LoginService, private router:Router, private cookieService:CookieService, private appService:AppService){
    this.loginService.authState.subscribe(async (state:boolean) => {
      if(!state)
        this.router.navigate(['/login']);
      else{
        await this.initCompanyDropdown();
        this.router.navigate(['/user'])
      }
      this.authState = state;
    })
    this.loginService.accessDenied.subscribe((deny) => {
      this.accessDenied = deny;
    })
  }
  async ngOnInit(): Promise<void> {
    this.jwt = this.cookieService.get('jwt')
    if(!this.jwt)
      this.loginService.challenge();
    else{
      await this.initCompanyDropdown();
      this.loginService.authState.next(true);
    }
      
  }
  async initCompanyDropdown():Promise<void> {
    if(!this.companies.length)
      await this.fillCompanyDropdown();
    if(this.cookieService.get('selectedCompany'))
      this.selectedCompany = this.cookieService.get('selectedCompany');
    else
      this.selectedCompany = this.companies[0].name;
  }
  async fillCompanyDropdown(): Promise<void> {
    this.companies = await lastValueFrom(this.appService.getCompanyList());
  }
  companyChanged():void{
    this.cookieService.set('selectedCompany', this.selectedCompany);
    window.location.reload();
  }
}
