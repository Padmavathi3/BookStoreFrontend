import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl:string="https://localhost:7112/api"

  private authHeader = new HttpHeaders({
   
    Authorization: `Bearer ${localStorage.getItem('AuthToken')}`
  })
  
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
  
  addToCartApi(endpoint:string,body:{bookId:any,quantity:any} ):Observable<any>
  {
    return this.http.post(this.baseUrl+endpoint,body,{headers: this.authHeader})
  }
  getAllCartApi(endpoint:string):Observable<any>
  {
    return this.http.get(this.baseUrl+endpoint,{headers: this.authHeader})
  }
  removebookFromCartApi(endpoint:string):Observable<any>{
    return this.http.delete(this.baseUrl+endpoint,{headers: this.authHeader})
  }
  updateQuantityApi(endpoint:string):Observable<any>
  {
    return this.http.patch(this.baseUrl+endpoint,{},{headers:this.authHeader})
  }
}
