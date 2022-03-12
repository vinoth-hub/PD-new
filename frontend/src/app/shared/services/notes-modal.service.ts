import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchService } from './search.service';

@Injectable({
  providedIn: 'root'
})
export class NotesModalService extends SearchService {
  baseUrl: string = environment.API_URL + 'search/shared/';
}
