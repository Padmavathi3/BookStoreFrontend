import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { AddressObj } from 'src/assets/addressInterface';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl:string="https://localhost:7094/api"

  private authHeader = new HttpHeaders({
   
    Authorization: `Bearer ${localStorage.getItem('AuthToken')}`
  })
  
  constructor(private http:HttpClient){}

  loginApi(email: string, password: string) : Observable<any>{
    return this.http.get(`${this.baseUrl}/User/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
 }


 signupApi(body: object): Observable<any> {
   
   return this.http.post(`${this.baseUrl}/User/SignUp`, body); // Send POST request with body
 }
   
  getAllBooksApi(endpoint:string):Observable<any>
  {
      return this.http.get(this.baseUrl+endpoint)
  }
  
  addToCartApi(endpoint:string,body:{bookId:any,quantity:any},token?:string ):Observable<any>
  {
    if(token!=null && token!=undefined)
      {
        return this.http.post(this.baseUrl+endpoint,body,{headers:new HttpHeaders({
          Authorization: `Bearer ${token}`
        })})
      }
    return this.http.post(this.baseUrl+endpoint,body,{headers: this.authHeader})
  }

  addToWishlist(endpoint: string, body: { bookId: any },token?:string): Observable<any> {
    if(token!=null && token!=undefined)
      {
        return this.http.post(this.baseUrl+endpoint,body,{headers:new HttpHeaders({
          Authorization: `Bearer ${token}`
        })})
      }
    return this.http.post(this.baseUrl + endpoint, body, { headers: this.authHeader });
  }
  
  addAddressApi(endpoint:string,body:AddressObj): Observable<any>
  {
     return this.http.post(this.baseUrl+endpoint,body,{headers:this.authHeader})
  }
  getAllCartApi(endpoint:string,token?:string):Observable<any>
  {
    if(token!=null && token!=undefined)
      {
        return this.http.get(this.baseUrl+endpoint,{headers:new HttpHeaders({
   
          Authorization: `Bearer ${token}`
        })})
      }
    return this.http.get(this.baseUrl+endpoint,{headers: this.authHeader})
  }

  getWishlist(endpoint: string,token?:string): Observable<any> {
    if(token!=null && token!=undefined)
      {
        return this.http.get(this.baseUrl+endpoint,{headers:new HttpHeaders({
   
          Authorization: `Bearer ${token}`
        })})
      }
    return this.http.get(this.baseUrl + endpoint, { headers: this.authHeader });
  }

  getCustomerAddress(endpoint: string): Observable<any> {
    return this.http.get(this.baseUrl + endpoint, { headers: this.authHeader });
  }

  getOrdersApi(endpoint:string):Observable<any>
  {
    return this.http.get(this.baseUrl+endpoint,{headers:this.authHeader})
  }
  addOrderApi(endpoint:string,body:any):Observable<any>
  {
    return this.http.post(this.baseUrl+endpoint,body,{headers:this.authHeader})
  }

  removebookFromCartApi(endpoint:string):Observable<any>{
    return this.http.delete(this.baseUrl+endpoint,{headers: this.authHeader})
  }
 
  removeBookFromWishlistApi(endpoint: string): Observable<any> {
    return this.http.delete(this.baseUrl + endpoint, { headers: this.authHeader });
  }

  removeAddressApi(endpoint:string):Observable<any>{
    return this.http.delete(this.baseUrl+endpoint,{headers:this.authHeader})
  }
  
  updateQuantityApi(endpoint:string,token?:string):Observable<any>
  {
    if(token!=null && token!=undefined)
      {
        return this.http.patch(this.baseUrl+endpoint,{},{headers:new HttpHeaders({
   
          Authorization: `Bearer ${token}`
        })})
      }
    return this.http.patch(this.baseUrl+endpoint,{},{headers:this.authHeader})
  }
 
  editAddressApi(endpoint:string,body:AddressObj):Observable<any>
  {
    return this.http.put(this.baseUrl+endpoint,body,{headers:this.authHeader})
  }
}
