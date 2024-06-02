import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderObj=new BehaviorSubject<any[]>([]);
  orderList=this.orderObj.asObservable();

  constructor(private httpService:HttpService) { }

  getAllOrders(orderBooks:any[])
    {
       this.orderObj.next(orderBooks);
    }
  

  getOrdersCall()
  {
    return this.httpService.getOrdersApi(`/Order/GetAllOrders`)
  }
  addOrderCall(body:any)
  {
    return this.httpService.addOrderApi(`/Order/AddOrder`,body)
  }
}
