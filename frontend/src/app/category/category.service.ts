import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  baseUrl: string = environment.API_URL + 'category/';
  constructor(private httpClient:HttpClient) { }
  getList(pageNumber: number, search: string):Observable<any>{
    return this.httpClient.get(`${this.baseUrl}?pageNumber=${pageNumber}&search=${search}`);
  }
  getSummary():Observable<any>{
    return this.httpClient.get(this.baseUrl + 'summary');
  }
  updateExpiration(categoryID: number, expiration: number):Observable<any>{
    return this.httpClient.put(this.baseUrl + 'expiration', {categoryID, expiration}, {responseType: 'text'})
  }
  delete(categoryID: number):Observable<any>{
    return this.httpClient.delete(this.baseUrl + categoryID);
  }
  getCriteriaOptions(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.baseUrl + 'criteria-options')
  }
  updateCriteria(categoryID: number, criteriaList: string[]): Observable<any> {
    return this.httpClient.put(this.baseUrl + 'criteria', {categoryID, criteriaList}, {responseType: 'text'})
  }
  editCategory(categoryID:number, name: string, expiration: number): Observable<unknown> {
    return this.httpClient.put(this.baseUrl, {categoryID, name, expiration}, {responseType: 'text'});
  }
  addCategory(sourceCategoryID: number, name: string, expiration: number): Observable<unknown> {
    return this.httpClient.post(this.baseUrl, {sourceCategoryID, name, expiration}, {responseType: 'text'});
  }
}
