import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order-service/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute,private orderservice:OrderService) { }
  orderDetail:any;

  ngOnInit(): void {
    this.orderservice.getOrdersCall().subscribe(res1=>{
      this.route.params.subscribe(res2=>{
        console.log(res2['addressId'])
       this.orderDetail= res1.data.filter((e:any)=>e.AddressId==res2['addressId'])[0]
      })
    })
  }

  continueShopping()
  {
     this.router.navigate(["/dashboard/books"])
  }
}
