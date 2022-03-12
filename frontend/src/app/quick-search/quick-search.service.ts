import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchService } from '../shared/services/search.service';

@Injectable({
  providedIn: 'root'
})
export class QuickSearchService extends SearchService {
  override baseUrl: string = environment.API_URL + 'search/quick/'
  submitQuery(searchQuery: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}submit?searchQuery=${searchQuery}`);
  }
  downloadFile(id:number):Observable<Blob>{
    return this.httpClient.get(`${this.baseUrl}download?pictureID=${id}`, {responseType: 'blob'});
  }
}
