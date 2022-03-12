import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class SearchService {
  abstract baseUrl:string;
  constructor(protected httpClient:HttpClient) { }
  getAccess():Observable<any>{
    return this.httpClient.get(`${this.baseUrl}access`, {responseType: 'text'});
  }
  updateNote(note: string | undefined, pictureID: number, notesID: number | undefined): Observable<unknown> {
    return this.httpClient.put(`${this.baseUrl}note`, {note, pictureID, notesID}, {responseType: 'text'});
  }
}
