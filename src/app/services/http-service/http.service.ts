import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl:string="https://localhost:7112/api"
  constructor(private http:HttpClient){}
   
  getAllBooksApi(endpoint:string):Observable<any>
  {
      return this.http.get(this.baseUrl+endpoint)
  }
  
}
