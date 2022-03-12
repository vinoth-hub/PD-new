import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchService } from '../shared/services/search.service';
import { PowerSearchFilterViewModel } from '../view-models/power-search-filter.view-model';
import { SearchResultViewModel } from '../view-models/search-result.view-model';

@Injectable({
  providedIn: 'root'
})
export class PowerSearchService extends SearchService {
  override baseUrl: string = environment.API_URL + 'search/power/';
  getCategoryList(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.baseUrl}category-options`);
  }
  submitQuery(searchFilter: PowerSearchFilterViewModel): Observable<SearchResultViewModel[]> {
    return this.httpClient.post<SearchResultViewModel[]>(`${this.baseUrl}submit`, searchFilter)
  }
  downloadFile(id: number): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}download?pictureID=${id}`, {responseType: 'blob'});
  }
}
