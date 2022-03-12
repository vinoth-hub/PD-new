import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { LoginService } from '../login/login.service';
import { SearchResultViewModel } from '../view-models/search-result.view-model';
import { QuickSearchService } from './quick-search.service';
import { PaginationWithFilter } from '../view-models/paginate-with-filter.view-model';


@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss']
})
export class QuickSearchComponent implements OnInit {
  searchQuery:string = '1234';
  showResults:boolean = false;
  notesDocument = new SearchResultViewModel;
  open:boolean = false;
  paginatedSearchResults: PaginationWithFilter<SearchResultViewModel> = new PaginationWithFilter<SearchResultViewModel>();
  constructor(private quickSearchService:QuickSearchService, private loginService: LoginService, private toastr:ToastrService) { }

  async ngOnInit(): Promise<void> {
    try{
      await lastValueFrom(this.quickSearchService.getAccess())
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
  async submitQuery(): Promise<void>{
    try{
      var list: SearchResultViewModel[] = await lastValueFrom(this.quickSearchService.submitQuery(this.searchQuery));
      this.paginatedSearchResults = new PaginationWithFilter<SearchResultViewModel>(list)
      this.showResults = true;
    }
    catch(err){
      this.toastr.error('Something went wrong');
    }
  }
  async downloadFile(id:number):Promise<void>{
    try{
      var result = await lastValueFrom(this.quickSearchService.downloadFile(id));
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
