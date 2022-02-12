import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  userFullName: string = '';
  defaultCompany:string = '';
  inProgressXhrCount: number = 0;
  constructor(private loginService:LoginService, private router:Router, private cookieService:CookieService, private appService:AppService){
    this.loginService.authState.subscribe(async (state:boolean) => {
      if(!state)
        this.router.navigate(['/login']);
      else{
        await this.initCompanyDropdown();
        if(!location.pathname || location.pathname === '/' || location.pathname === '/login') // ActivatedRoute is not available here, so use window.location
          this.router.navigate(['/user'])
        if(!this.selectedCompany && this.cookieService.get('selectedCompany'))
          this.selectedCompany = this.cookieService.get('selectedCompany');
        if(!this.userFullName && this.cookieService.get('userFullName'))
          this.userFullName = this.cookieService.get('userFullName');
        if(!this.defaultCompany && this.cookieService.get('defaultCompany'))
          this.defaultCompany = this.cookieService.get('defaultCompany');
      }
      this.authState = state;
    })
    this.loginService.accessDenied.subscribe((deny) => {
      this.accessDenied = deny;
    })
    this.appService.companiesUpdated.subscribe((updatedCompanies) => {
      this.companies = updatedCompanies;
    })
    this.appService.httpEvent.subscribe((ev) => {
      if(this.inProgressXhrCount < 0) // Something is wrong. Reset. Typically this case will not be executed except in case of severe error
        this.inProgressXhrCount = 0;
      if(ev)
        this.inProgressXhrCount++;
      else
        this.inProgressXhrCount--;
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
