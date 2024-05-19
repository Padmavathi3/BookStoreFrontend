import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  continueShopping()
  {
     this.router.navigate(["/dashboard/books"])
  }
}
