import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpService:HttpService) { }

  getOrdersCall()
  {
    return this.httpService.getOrdersApi(`/Order/GetAllOrders`)
  }
  addOrderCall(body:any)
  {
    return this.httpService.addOrderApi(`/Order/AddOrder`,body)
  }
}
