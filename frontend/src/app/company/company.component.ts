import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { AppService } from '../app.service';
import { LoginService } from '../login/login.service';
import { CompanyFormViewModel } from '../view-models/company-form.view-model';
import { Company } from '../view-models/company.view-model';
import { PaginationViewModel } from '../view-models/pagination.view-model';
import { CompanyService } from './company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companies:Company[] = [];
  allTimezones: any[] = [];
  pagination: PaginationViewModel = new PaginationViewModel;
  modalRef: BsModalRef;
  companyForm: CompanyFormViewModel = new CompanyFormViewModel;
  searchQuery: string = '';
  constructor(private companyService: CompanyService,
    private toastr:ToastrService,
    private modalService: BsModalService,
    private loginService: LoginService,
    private appService:AppService,
    private cookieService:CookieService) { 
    this.modalRef = new BsModalRef;
  }

  async ngOnInit(): Promise<void> {
    try{
      await Promise.all([
        this.loadTimezones(),
        this.refreshCompanies(1),
        this.fillCompanyDropdown()
      ]);
      this.loginService.accessDenied.next(false)
    }
    catch(err){
      if(err instanceof HttpErrorResponse){
        if(err.status === 403)
          this.loginService.accessDenied.next(true);
        else
          this.toastr.error('Something went wrong');
      }
      else
        this.toastr.error('Something went wrong');
    }
  }
  async refreshCompanies(pageNumber: number): Promise<any> {
    let response = await lastValueFrom(this.companyService.getCompanyList(pageNumber, this.searchQuery));
    this.companies = response.list;
    this.pagination = new PaginationViewModel(Math.ceil(response.count/25));
    this.pagination.activeIndex = pageNumber - 1;
  }
  async loadTimezones(): Promise<any> {
    this.allTimezones = await lastValueFrom(this.companyService.getAllTimezones());
  }
  async paginateTo(targetPage:number): Promise<void>{ // Pagination done on server side
    await this.refreshCompanies(targetPage)
  }
  async paginatePrevious(): Promise<void>{
    let activeIndex: number = this.pagination.activeIndex;
    if(activeIndex === 0)
      return;
    await this.paginateTo(activeIndex)
  }
  async paginateNext(): Promise<void>{
    let activeIndex: number = this.pagination.activeIndex;
    if(activeIndex === this.pagination.itemCount - 1)
      return;
    await this.paginateTo(activeIndex + 2);
  }
  async setTimezone(companyId: number, timezone: string): Promise<void> {
    try{
      await lastValueFrom(this.companyService.setTimezone(companyId, timezone));
      this.toastr.success('Timezone updated');
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async setDst(companyId: number, dst: boolean): Promise<void> {
    try{
      await lastValueFrom(this.companyService.setDst(companyId, dst));
      this.toastr.success('Daylight saving time updated');
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async delete(companyId: number): Promise<void> {
    try{
      if(companyId.toString() === this.cookieService.get('selectedCompany'))
      await lastValueFrom(this.companyService.deleteById(companyId));
      this.toastr.success('Company deleted');
      await this.reloadCompanies()
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  openModal(template: TemplateRef<any>, companyInForm:Company){
    this.modalRef = this.modalService.show(template);
    this.companyForm.company = Object.assign({}, companyInForm);
  }
  async submitForm():Promise<void>{
    try{
      if(this.companyForm.company.companyID > 0){
        await lastValueFrom(this.companyService.updateCompany(this.companyForm.company));
        this.toastr.success('Company updated');
      }
      else{
        await lastValueFrom(this.companyService.createCompany({
          company: this.companyForm.company, 
          copyFromId: this.companyForm.copyFromCompanyId
        }));
        this.toastr.success('Company added');
      }
      this.modalRef.hide()
      await this.reloadCompanies();
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  beginAddCompany(template: TemplateRef<any>):void{
    this.openModal(template, new Company)
  }
  async fillCompanyDropdown(): Promise<Company[]> {
    this.companyForm.companyList = await lastValueFrom(this.appService.getCompanyList());
    return this.companyForm.companyList;
  }
  async reloadCompanies():Promise<void>{
    await this.refreshCompanies(1);
    var updatedCompanies = await this.fillCompanyDropdown();
    this.appService.companiesUpdated.next(updatedCompanies);
  }
}
