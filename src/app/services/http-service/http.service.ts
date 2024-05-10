import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl:string="https://localhost:7112/api"
  constructor(private http:HttpClient){}

  loginApi(email: string, password: string) : Observable<any>{
    return this.http.get(`${this.baseUrl}/Users/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
 }


 signupApi(body: object): Observable<any> {
   
   return this.http.post(`${this.baseUrl}/Users/SignUp`, body); // Send POST request with body
 }
   
  getAllBooksApi(endpoint:string):Observable<any>
  {
      return this.http.get(this.baseUrl+endpoint)
  }
  
}
