import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from './view-models/company.view-model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  baseUrl: string;
  companiesUpdated: Subject<Company[]>;

  constructor(private httpClient: HttpClient) { 
    this.baseUrl = environment.API_URL;
    this.companiesUpdated = new Subject;
  }
  getCompanyList(): Observable<Company[]> {
    return this.httpClient.get<Company[]>(this.baseUrl + 'companies');
  }
}
