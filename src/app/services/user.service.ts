import { Injectable } from '@angular/core';
import { HttpService } from './http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpService) { }

  loginCall(email: string, password: string){
    return this.http.loginApi(email, password)
  }

  signupCall(userData: object){
    return this.http.signupApi(userData)
  }
}
