import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../view-models/company.view-model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  baseUrl: string = environment.API_URL + 'company/';
  constructor(private httpClient:HttpClient) { }
  getAllTimezones():Observable<any>{
    return this.httpClient.get(this.baseUrl + 'timezones/all');
  }
  getCompanyList(pageNumber:number):Observable<any>{
    return this.httpClient.get(`${this.baseUrl}?pageNumber=${pageNumber}`);
  }
  getCompanySummaryList():Observable<any>{
    return this.httpClient.get(this.baseUrl + 'summary');
  }
  getCompanyDetails(companyId: number):Observable<any>{
    return this.httpClient.get(`${this.baseUrl}summary/${companyId}`);
  }
  setTimezone(companyId: number, timezone: string):Observable<any>{
    return this.httpClient.put(`${this.baseUrl}timezone`, {companyId, timezone});
  }
  setDst(companyId: number, dst: boolean): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}dst`, {companyId, dst})
  }
  deleteById(companyId: number):Observable<any>{
    return this.httpClient.delete(`${this.baseUrl}${companyId}`);
  }
  updateCompany(company: Company): Observable<any> {
    return this.httpClient.put(this.baseUrl, company);
  }
  createCompany(postData: any): Observable<any>{
    return this.httpClient.post(this.baseUrl, postData, {responseType: 'text'});
  }
}
