import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../login/login.service';
import { SearchResultViewModel } from '../view-models/search-result.view-model';
import { PaginationWithFilter } from '../view-models/paginate-with-filter.view-model';
import { PowerSearchFilterViewModel } from '../view-models/power-search-filter.view-model';
import { AppService } from '../app.service'
import { CookieService } from 'ngx-cookie-service';
import { PowerSearchService } from './power-search.service';

@Component({
  selector: 'app-power-search',
  templateUrl: './power-search.component.html',
  styleUrls: ['./power-search.component.scss']
})
export class PowerSearchComponent implements OnInit {
  showResults:boolean = false;
  paginatedSearchResults: PaginationWithFilter<SearchResultViewModel> = new PaginationWithFilter<SearchResultViewModel>();
  searchFilter:PowerSearchFilterViewModel = new PowerSearchFilterViewModel;
  defaultCompany: string = ''
  notesDocument = new SearchResultViewModel;
  open:boolean = false;
  constructor(private powerSearchService:PowerSearchService,
    private loginService: LoginService,
    private toastr:ToastrService,
    private appService:AppService,
    private cookieService:CookieService) { }

  async ngOnInit(): Promise<void> {
    try{
      if(!this.defaultCompany && this.cookieService.get('defaultCompany'))
        this.defaultCompany = this.cookieService.get('defaultCompany');
      await Promise.all([
        this.getAccess(),
        this.fillCompanyOptions(),
        this.fillCategoryOptions()
      ]);
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
  async getAccess(): Promise<void>{
    await lastValueFrom(this.powerSearchService.getAccess());
  }
  async fillCompanyOptions(): Promise<void>{
    this.searchFilter.companyOptions = await lastValueFrom(this.appService.getCompanyList())
  }
  async fillCategoryOptions():Promise<void>{
    this.searchFilter.categoryOptions = await lastValueFrom(this.powerSearchService.getCategoryList());
  }
  async submitQuery(): Promise<void>{
    if(!this.searchFilter.searchQuery || !this.searchFilter.selectedCompanies.length || !this.searchFilter.selectedCategories.length || !this.searchFilter.documentDateFrom || !this.searchFilter.documentDateTo || !this.searchFilter.scannedDateFrom || !this.searchFilter.scannedDateTo){
      this.toastr.error('All fields are required');
      return;
    }
    try{
      var list: SearchResultViewModel[] = await lastValueFrom(this.powerSearchService.submitQuery(this.searchFilter));
      this.paginatedSearchResults = new PaginationWithFilter(list);
      this.showResults = true;
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async downloadFile(id:number):Promise<void>{
    try{
      var result = await lastValueFrom(this.powerSearchService.downloadFile(id));
      let url = window.URL.createObjectURL(result);
      window.open(url);
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async onNoteEdit(result: SearchResultViewModel){
    this.open = true;
    this.notesDocument = Object.assign({}, result);
  }
  notesSaved(){
    this.open = false
  }
}
