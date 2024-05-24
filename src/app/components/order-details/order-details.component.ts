import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order-service/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  OrderItems:any;
  constructor(private orderService:OrderService) { }

  ngOnInit(): void {
    if (localStorage.getItem('AuthToken') !== null) {
      this.orderService.getOrdersCall().subscribe(res => {
        this.OrderItems = res.data;
      }, err => {
        console.error('Error fetching orderlist', err);
      });
    } 
    else{
      alert("Do login, After login only You can see your orderlist")
    }
  }

}
