import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BookService } from 'src/app/services/book-service/book.service';
import { BookObj } from 'src/assets/booksInterface';
import { LOCATION_ICON, SEARCH_ICON } from 'src/assets/svg-icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems:BookObj[]=[]
  constructor(private bookService:BookService,private domSanitizer:DomSanitizer,private matIconRegistry:MatIconRegistry) { 
    matIconRegistry.addSvgIconLiteral("location-icon", domSanitizer.bypassSecurityTrustHtml(LOCATION_ICON))

  }

  ngOnInit(): void {

    this.cartItems = this.bookService.getCartItems();
    }
    
    removeFromCart(book: BookObj) {
      this.bookService.removeFromCart(book);
      this.cartItems = this.bookService.getCartItems();
    }
  }



